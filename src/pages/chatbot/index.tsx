
import Chatbot from "@/components/chatbot";
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

type ConversationHistory = {
  id: number
  human_message: string
  ai_message: string
  conversation_id: string
  uploaded_file_detail: FileInfo[]
  responded_media: RespondedFile[]
}

export async function getServerSideProps(context: any) {
  const {uuid} = context.query;
  if (!uuid) return {props: {}};
  const headers = new Headers();
  headers.append('X-Conversation-Id', uuid);

  const res = await fetch(`${LANGCHAIN_SERVER_URL}/conversate`, {
    method: 'GET',
    headers: headers
  });

  if (res.status !== 200) {
    return {props: {
      initialMessages: [],
      conversationId: uuid,
    }}
  }

  const messages: ConversationHistory[] = await res.json();
  const processed = []
  for (let msg of messages) {
    const files = []
    if ('uploaded_file_detail' in msg && (msg['uploaded_file_detail'] ?? []).length >= 1) {
      for (let detail of msg['uploaded_file_detail']) {
        files.push({type: 'file', name: detail['filename']});
      }
    }

    const responded_media_list = [];
    if ('responded_media' in msg && (msg['responded_media'] ?? []).length >= 1) {
      for (const media of msg['responded_media']) {
        responded_media_list.push({src: `data:${media.content_type};base64,${media.content}`, type: 'image'})
      }
    }
    processed.push({files: files, role: 'user', text: msg.human_message});
    processed.push({files: responded_media_list, role: 'ai', text: msg.ai_message});
  }

  return {props: {
    messages: processed,
    conversationId: uuid,
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
