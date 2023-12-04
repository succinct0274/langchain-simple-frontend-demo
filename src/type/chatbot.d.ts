export type FileInfo = {
  filename: string
  mime_type: string
}

export type RespondedFile = {
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

type MessageContent = {
  files: any[],
  role: string,
  text: string,
}

export type ConversationHistoryResponse = {
  messages: MessageContent[],
  conversationId: string,
}
