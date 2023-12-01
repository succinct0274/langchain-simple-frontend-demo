'use client'
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ChatbotHeader from "./chatbot-header";
import FloatingButton from "./floating-button";
import { ConversationHistory } from "@/app/chatbot/page";
import { DeepChat } from "deep-chat-react";

export const LANGCHAIN_SERVER_URL = process.env.NEXT_PUBLIC_LANGCHAIN_SERVER_URL
type Props = {
  initialMessages: Array<any>,
  cid: string,
}

type ChatResponse = {
  text: string
  image: string
};

export default function Chatbot({ initialMessages, cid }: Props) {
  const [conversationId, setConversationId] = useState<string>(cid);
  const [messages, setMessages] = useState<ConversationHistory[]>(initialMessages);
  const ref = useRef<HTMLDivElement>(null);
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    if (!!conversationId) {
      sessionStorage.setItem('conversationId', conversationId);
    }
  }, []);

  const toggleCloseButton = () => {
    setClosed(!closed);
  }

  // const DeepChat = dynamic(
  //   () => import("deep-chat-react").then((mod) => mod.DeepChat),
  //   {
  //     ssr: false,
  //   },
  // )

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
                if (!!sessionStorage.getItem('conversationId')) {
                  headers['X-Conversation-Id'] = sessionStorage.getItem('conversationId')
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

                console.log(`LANGCHAIN_SERVER_URL: ${LANGCHAIN_SERVER_URL}`)
                fetch(`/api/langchains/conversate`, {
                  method: 'POST',
                  headers: headers,
                  body: formData,
                }).then(res => {
                  if (res.status !== 200) {
                    return Promise.reject(res);
                  }

                  const cid = res.headers.get('x-conversation-id');
                  if (cid) {
                    sessionStorage.setItem('conversationId', cid)
                  }
                  console.log(res);
                  return res.json()
                }).then(output => {
                  const files = [];
                  if ('image' in output) {
                    for (const image of output['image']) {
                      files.push({src: `data:${image.content_type};base64,${image.content}`, type: 'image'});
                    }
                  }
                  console.log('getting here weird')
                  signals.onResponse({ 
                    text: output['text'],
                    files: files
                  });
                }).catch(err => err.json()).then(message => {
                  console.error(`Received error from backend server during conversation: ${message['detail']}`);
                  signals.onResponse({
                    error: message['detail']
                  });
                });
              }
            }}
            style={{ borderRadius: "10px", borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none' }}
            textInput={{ placeholder: { text: "Talk to our AI assistant" } }}
            initialMessages={messages}
            mixedFiles={true}
            introMessage={{ text: 'Hi, I am your assistant, ask me anything!' }}
            errorMessages={{
              displayServiceErrorMessages: true
            }}
            // stream={{simulation: true}}
          />
        </div>
      }  
    </>
    
  )
}
