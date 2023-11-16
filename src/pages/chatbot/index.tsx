
import dynamic from "next/dynamic";
import { useState } from "react";

export default function Home() {
  const LANGCHAIN_SERVER_URL = 'http://localhost:8000/langchains'
  const [conversationId, setConversationId] = useState<string>('');
  const initialMessages: any[] = [
  ];

  const DeepChat = dynamic(
    () => import("deep-chat-react").then((mod) => mod.DeepChat),
    {
      ssr: false,
    },
  )

  const initiateSession = async (signals: any) => {
    await fetch(`${LANGCHAIN_SERVER_URL}/session/init`, { method: 'POST' }).then(async res => {
      const data = await res.json()
      setConversationId(data['conversation_id']);
    }).catch(err => {
      signals.onResponse({error: 'Error'});
    })
  }

  const processFormData: (body: FormData) => readonly [string, Array<File>] = (body: FormData) => {
    // Assume body is using form data as mixedFiles enabled
    const files: Array<File> = [];
    let question = '';
    for (const [type, content] of (body as FormData).entries()) {
      if (type === 'message1') {
        question = JSON.parse(content.toString())?.text ?? '';
        continue
      }
      
      if (type !== 'files') continue;
      files.push(content as File);
    }

    return [question, files];
  }

  return (
    <DeepChat
          request={{
            handler: async (body, signals) => {
              // if (!conversationId) {
              //   await initiateSession(signals);
              // }

              let question: string;
              let files: Array<File> | null = null;
              if (body instanceof FormData) {
                [question, files] = processFormData(body);
              } else {
                const last = body?.messages.length - 1;
                question = body?.messages[last]?.text ?? '';
              }

              // Define custom headers
              const headers = new Headers();
              if (!!conversationId) {
                headers.set('X-Conversation-Id', conversationId);
              }
              
              // Define custom body
              const formData = new FormData();
              formData.append('question', question);
              
              if (files != null) {
                for (const file of files) {
                  formData.append('files', file);
                }
              }
              
              // signals.onResponse({'text': 'Response'});
              fetch(`${LANGCHAIN_SERVER_URL}/conversate`, {
                method: 'POST',
                headers: headers,
                body: formData,
              })
              .then(res => {
                const cid = res.headers.get('X-Conversation-Id');
                if (cid) {
                  setConversationId(cid);
                }
                return res.json();
              })
              .then(output => {
                signals.onResponse({text: output['text']});
              });

            }
          }}
          style={{ borderRadius: "10px" }}
          textInput={{ placeholder: { text: "Talk to our AI assistant" } }}
          initialMessages={initialMessages}
          mixedFiles={true}
          introMessage={{text: 'Hi, I am your assistant, ask me anything!'}}
          stream={{ simulation: true }}
        />
  )
}
