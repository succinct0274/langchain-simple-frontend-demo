'use client'
import { MessageContent } from "@/type/chatbot";
import DescriptionList from "./description-list";
import dynamic from "next/dynamic";
import { MutableRefObject, useRef } from "react";

const DynamicComponentWithNoSSR = dynamic(() => import("./chatbot"), {
  ssr: false,
});
type Props = {
  messages: MessageContent[];
  conversationId: string;
};

const DescriptionWithFloatingButton = (props: Props) => {
  const { messages, conversationId } = props;
  const promptRef = useRef<HTMLDivElement>();

  return (
    <>
      <div className="h-screen px-60 pt-20">
        <DescriptionList promptRef={promptRef} conversationId={conversationId} />
      </div>
      <DynamicComponentWithNoSSR
        promptRef={promptRef}
        initialMessages={messages}
        conversationId={conversationId}
      />
    </>
  );
};

export default DescriptionWithFloatingButton;
