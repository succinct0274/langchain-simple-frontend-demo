"use client";
import { MessageContent } from "@/type/chatbot";
import { DeepChat } from "deep-chat-react";
import React, { useEffect, useState } from "react";
import ChatbotHeader from "./chatbot-header";
import FloatingButton from "./floating-button";
type Props = {
  initialMessages: MessageContent[];
  conversationId: string;
};

const Chatbot = ({ conversationId, initialMessages: messages }: Props) => {
  const [closed, setClosed] = useState(false);

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
    const headers: any = {};
    headers["X-Conversation-Id"] = conversationId;
    console.log("Included custom header", conversationId);

    // Define custom body
    const formData = new FormData();
    formData.append("question", question);

    if (files != null) {
      for (const file of files) {
        formData.append("files", file);
      }
    }
    const LANGCHAIN_SERVER_URL = process.env.NEXT_PUBLIC_LANGCHAIN_SERVER_URL;
    fetch(LANGCHAIN_SERVER_URL + `/langchains/conversate`, {
      method: "POST",
      headers: headers,
      body: formData,
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
      {!closed && (
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
