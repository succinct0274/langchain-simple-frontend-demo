'use client'
import { ConversationHistoryResponse, MessageContent } from "@/type/chatbot";
import Chatbot from "./chatbot";
import DescriptionList from "./description-list";

type Props = {
  messages: MessageContent[],
  conversationId: string,
}

export default function DescriptionWithFloatingButton({ messages, conversationId }: Props) {
  return (
    <>
      <div className="h-screen px-60 pt-20">
        <DescriptionList />
      </div>
      <Chatbot initialMessages={messages} cid={conversationId} />
    </>
  )
}