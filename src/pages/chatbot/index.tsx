
import Chatbot from "@/components/chatbot";
import { fetchConversationHistory } from "@/util/fetchConversationHistory";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";

const LANGCHAIN_SERVER_URL = 'http://127.0.0.1:8000/langchains'

type FileInfo = {
  filename: string
  mime_type: string
}

type RespondedFile = {
  content: string
  content_type: string
}

export type ConversationHistory = {
  id: number
  human_message: string
  ai_message: string
  conversation_id: string
  uploaded_file_detail: FileInfo[]
  responded_media: RespondedFile[]
}

export async function getServerSideProps(context: any) {
  const {uuid} = context.query;
  if (!uuid) return {props: {
    messages: [],
    conversationId: null
  }};

  const res = await fetchConversationHistory(uuid);
  return {props: {
    ...res
  }}
}

type Props = {
  messages: Array<object>,
  conversationId: string,
}

export default function Home({messages, conversationId}: Props) {
  return (
    <Chatbot initialMessages={messages} cid={conversationId} />
  )
}
