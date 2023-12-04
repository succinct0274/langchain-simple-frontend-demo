'use client'
import { ConversationHistoryResponse, MessageContent } from "@/type/chatbot";
import Chatbot from "./chatbot";
import DescriptionList from "./description-list";
import { useState } from "react";

type Props = {
  messages: MessageContent[],
  conversationId: string,
}

export default function DescriptionWithFloatingButton(props: Props) {
  const messages = props.messages
  const [conversationId, setConversationId] = useState(props.conversationId)

  return (
    <>
      <div className="h-screen px-60 pt-20">
        <DescriptionList />
      </div>
      <Chatbot initialMessages={messages} conversationId={conversationId} setConversationId={setConversationId} />
    </>
  )
}