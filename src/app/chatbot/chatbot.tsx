"use client";
import { MessageContent } from "@/type/chatbot";
import { DeepChat } from "deep-chat-react";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import ChatbotHeader from "./chatbot-header";
import FloatingButton from "./floating-button";
import { publish } from '../../lib/event';
type Props = {
  initialMessages: MessageContent[];
  conversationId: string;
};

type UploadedFileMetadata = {
  file_id: string;
  filename: string;
  upload_date: number;
  content_type: string;
}

const Chatbot = ({ conversationId, initialMessages: messages }: Props) => {
  const [closed, setClosed] = useState(false);
  const deepChatRef: MutableRefObject<any> = useRef();
  let uploadedFiles: Set<UploadedFileMetadata> = new Set();
  let observer: MutationObserver;

  useEffect(() => {
    const elem = deepChatRef.current as any;
    elem.onAttachmentChange = (attachements: any[], file: File) => {
      if (attachements.length < uploadedFiles.size) {
        const newSet = new Set<UploadedFileMetadata>();
        const unique = new Set(attachements.map(a => a.file as File).map(f => f.name));
        
        uploadedFiles.forEach(uf => { if (unique.has(uf.filename)) newSet.add(uf) });
        uploadedFiles = newSet;
        return;
      }
      // Send files to the backend server once event triggered
      const formData = new FormData();
      for (const attachment of attachements) {
        formData.append('files', attachment.file);
      }

      fetch(`/api/langchains/${conversationId}/files`, {
        method: 'POST',
        body: formData,
      }).then(res => res.json()).then((list: any[]) => {
        for (const uploaded of list) {
          uploadedFiles.add(uploaded);
        }
      
        publish('updateFileList', list);
      })
    };
    
  }, [])

  const toggleCloseButton = () => {
    console.log("[open]");
    setClosed(!closed);
  };

  const handler = async (body: any, signals: any) => {
    let question: string;
    let files: Array<File> | null = null;
    if (body instanceof FormData) {
      [question, files] = processFormData(body);
    } else {
      const last = body?.messages.length - 1;
      question = body?.messages[last]?.text ?? "";
    }

    // Define custom headers
    // const headers = new Headers();
    console.log("Included custom header", conversationId);
    const headers: any = {};
    headers["X-Conversation-Id"] = conversationId;
    headers['Content-Type'] = 'application/json';

    // Construct request body
    const json = {
      'question': question,
      'metadata': {
        'attachment': [...uploadedFiles]
      }
    }

    // Define custom body
    // const formData = new FormData();
    // formData.append("question", question);

    // if (files != null) {
    //   for (const file of files) {
    //     formData.append("files", file);
    //   }
    // }

    fetch(`/api/langchains/conversate`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(json),
      cache: "no-store",
    })
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject(res);
        }

        const cid = res.headers.get("x-conversation-id");
        if (cid) {
          sessionStorage.setItem("conversationId", cid);
          // setsessionId(cid);
          window.dispatchEvent(new Event("storage"));
        }
        console.log(res);
        return res.json();
      })
      .then((output) => {
        const files = [];
        if ("image" in output) {
          for (const image of output["image"]) {
            files.push({
              src: `data:${image.content_type};base64,${image.content}`,
              type: "image",
            });
          }
        }

        signals.onResponse({
          text: output["text"],
          files: files,
        });

        return Promise.resolve();
      })
      .catch(async (err) => {
        const message = err?.toString();
        console.error(
          `Received error from backend server during conversation: ${message}`
        );
        signals.onResponse({
          error: message["detail"],
        });
      });
  };

  const processFormData: (body: FormData) => readonly [string, Array<File>] = (
    body: FormData
  ) => {
    // Assume body is using form data as mixedFiles enabled
    const files: Array<File> = [];
    let question = "";
    for (const [type, content] of (body as FormData).entries()) {
      if (type === "message1") {
        question = JSON.parse(content.toString())?.text ?? "";
        continue;
      }

      if (type !== "files") continue;
      files.push(content as File);
    }

    return [question, files];
  };

  return (
    <>
      <FloatingButton
        toggleCloseButton={toggleCloseButton}
        style={{ position: "fixed", bottom: "5vh", right: "10vw", zIndex: 1 }}
      />
      {(
        <div
          key="chatbot-dialog"
          style={{
            visibility: !closed ? "visible" : "hidden",
            position: "fixed",
            bottom: "2vh",
            right: "5vw",
            zIndex: 1,
          }}
        >
          <ChatbotHeader
            style={{ visibility: "inherit" }}
            toggleCloseButton={toggleCloseButton}
          />
          {conversationId && (
            <DeepChat
              ref={deepChatRef}
              request={{
                handler: handler,
              }}
              style={{
                visibility: "inherit",
                borderRadius: "10px",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderTop: "none",
              }}
              textInput={{
                placeholder: { text: "Talk to our AI assistant" },
              }}
              initialMessages={messages}
              mixedFiles={{
                files: {acceptedFormats: '.xlsx,.pdf'},
              }}
              introMessage={{
                text: "Hi, I am your assistant, ask me anything!",
              }}
              errorMessages={{
                displayServiceErrorMessages: true,
              }}
              stream={{ simulation: true }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
