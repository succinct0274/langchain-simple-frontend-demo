
import Chatbot from "@/components/chatbot";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";

const LANGCHAIN_SERVER_URL = 'http://127.0.0.1:8000/langchains'

type ConversationHistory = {
  id: number,
  human_message: string,
  ai_message: string,
  conversation_id: string,
}

export async function getServerSideProps(context: any) {
  const {uuid} = context.query;
  if (!uuid) return {props: {}};
  const headers = new Headers();
  headers.append('X-Conversation-Id', uuid);

  console.log(`${LANGCHAIN_SERVER_URL}/conversate`)

  const res = await fetch(`${LANGCHAIN_SERVER_URL}/conversate`, {
    method: 'GET',
    headers: headers
  });

  if (res.status !== 200) {
    return {props: {
      initialMessages: [],
    }}
  }

  const messages: ConversationHistory[] = await res.json();
  const processed = []
  for (let msg of messages) {
    processed.push({role: 'user', text: msg.human_message});
    processed.push({role: 'ai', text: msg.ai_message});
  }

  return {props: {
    messages: processed,
  }}
}

type Props = {
  messages: Array<object>,
}

export default function Home({messages}: Props) {
  return (
    <Chatbot initialMessages={messages}/>
  )
}
