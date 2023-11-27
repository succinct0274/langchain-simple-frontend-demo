
import Chatbot from "@/app/chatbot/chatbot";
import { fetchConversationHistory } from "@/util/fetchConversationHistory";

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
  role: string
  human_message: string
  ai_message: string
  conversation_id: string
  uploaded_file_detail: FileInfo[]
  responded_media: RespondedFile[]
}

type Props = {
  searchParams: {uuid: string}
}

export default async function Home({ searchParams }: Props) {
  const { uuid } = searchParams;
  const { messages, conversationId } = await fetchConversationHistory(uuid);

  console.log(conversationId)

  return (
    <Chatbot initialMessages={messages} cid={conversationId} />
  )
}
