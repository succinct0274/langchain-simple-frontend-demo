import { NextRequest } from "next/server";

const LANGCHAIN_SERVER_URL = process.env.LANGCHAIN_SERVER_URL;

export async function POST(
  req: NextRequest
) {
  const conversationId = req.headers.get('x-conversation-id') ?? null;
  const headers: any = {}
  if (!!conversationId) {
      headers['X-Conversation-Id'] = conversationId;
  }

  return fetch(`${LANGCHAIN_SERVER_URL}/langchains/upload`, {
    method: 'POST',
    headers: headers,
    body: await req.formData(),
  });
}

