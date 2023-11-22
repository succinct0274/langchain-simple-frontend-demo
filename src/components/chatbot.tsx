'use client'
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ChatbotHeader from "./chatbot-header";
import FloatingButton from "./floating-button";

export const LANGCHAIN_SERVER_URL = 'http://127.0.0.1:8000/langchains'
type Props = {
  initialMessages: Array<object>,
  cid: string,
}

type ChatResponse = {
  text: string
  image: string
};

export default function Chatbot({ initialMessages, cid }: Props) {
  const [conversationId, setConversationId] = useState<string>(cid);
  const [messages, setMessages] = useState<object[]>(initialMessages);
  const ref = useRef<HTMLDivElement>(null);
  const [closed, setClosed] = useState(true);

  const toggleCloseButton = () => {
    setClosed(!closed);
  }

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
      signals.onResponse({ error: 'Error' });
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
    <>
      <FloatingButton toggleCloseButton={toggleCloseButton} style={{position: 'fixed', bottom: '5vh', right: '10vw', zIndex: 1}} />
      {
        !closed && <div key='chatbot-dialog' ref={ref} style={{position: 'fixed', bottom: '2vh', right: '5vw', zIndex: 1}}>
          <ChatbotHeader toggleCloseButton={toggleCloseButton} />
          <DeepChat
            request={{
              handler: async (body, signals: any) => {

                let question: string;
                let files: Array<File> | null = null;
                if (body instanceof FormData) {
                  [question, files] = processFormData(body);
                } else {
                  const last = body?.messages.length - 1;
                  question = body?.messages[last]?.text ?? '';
                }

                // Define custom headers
                // const headers = new Headers();
                const headers: any = {};
                if (!!conversationId) {
                  // headers.set('X-Conversation-Id', conversationId);
                  headers['X-Conversation-Id'] = conversationId
                  console.log('Included custom header')
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
                  // mode: 'no-cors',
                  body: formData,
                })
                  .then(res => {
                    res.headers.forEach((v, k) => {
                      console.log(`key: ${k} - value: ${v}`)
                    })
                    const cid = res.headers.get('x-conversation-id');
                    if (cid) {
                      setConversationId(cid);
                    }
                    return res.json()
                  })
                  .then(output => {
                    const files = [];
                    if ('image' in output) {
                      for (const image of output['image']) {
                        files.push({src: `data:${image.content_type};base64,${image.content}`, type: 'image'});
                      }
                    }

                    signals.onResponse({ 
                      text: output['text'],
                      files: files
                    });
                  });

              }
            }}
            style={{ borderRadius: "10px", borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none' }}
            textInput={{ placeholder: { text: "Talk to our AI assistant" } }}
            initialMessages={messages}
            mixedFiles={true}
            introMessage={{ text: 'Hi, I am your assistant, ask me anything!' }}
            // stream={{simulation: true}}
          />
        </div>
      }  
    </>
    
  )
}
