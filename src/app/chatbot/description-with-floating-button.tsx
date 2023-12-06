"use client";
import { MessageContent } from "@/type/chatbot";
import Chatbot from "./chatbot";
import DescriptionList from "./description-list";

type Props = {
  messages: MessageContent[];
  conversationId: string;
};

export default function DescriptionWithFloatingButton(props: Props) {
  const { messages, conversationId } = props;

  return (
    <>
      <div className="h-screen px-60 pt-20">
        <DescriptionList conversationId={conversationId} />
      </div>
      <Chatbot initialMessages={messages} conversationId={conversationId} />
    </>
  );
}
