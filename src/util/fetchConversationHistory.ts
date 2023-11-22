import { LANGCHAIN_SERVER_URL } from "@/components/chatbot";
import { ConversationHistory } from "@/pages/chatbot";


export const fetchConversationHistory = async (uuid: string) => {
  const headers = new Headers();
  headers.append('X-Conversation-Id', uuid);

  const res = await fetch(`${LANGCHAIN_SERVER_URL}/conversate`, {
    method: 'GET',
    headers: headers
  });

  if (res.status !== 200) {
    return {
      props: {
        initialMessages: [],
        conversationId: uuid,
      }
    }
  }

  const messages: ConversationHistory[] = await res.json();
  const processed = []
  for (let msg of messages) {
    const files = []
    if ('uploaded_file_detail' in msg && (msg['uploaded_file_detail'] ?? []).length >= 1) {
      for (let detail of msg['uploaded_file_detail']) {
        files.push({ type: 'file', name: detail['filename'] });
      }
    }

    const responded_media_list = [];
    if ('responded_media' in msg && (msg['responded_media'] ?? []).length >= 1) {
      for (const media of msg['responded_media']) {
        responded_media_list.push({ src: `data:${media.content_type};base64,${media.content}`, type: 'image' })
      }
    }
    processed.push({ files: files, role: 'user', text: msg.human_message });
    processed.push({ files: responded_media_list, role: 'ai', text: msg.ai_message });
  }


  return {
    messages: processed,
    conversationId: uuid,
  }
}