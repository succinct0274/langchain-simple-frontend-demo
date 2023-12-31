import { NextRequest } from "next/server";

export type ConversationResponse = {
  text: string;
  image: object[];
};

const LANGCHAIN_SERVER_URL = process.env.LANGCHAIN_SERVER_URL;

export async function POST(
  req: NextRequest
  //   res: NextApiResponse
) {
  const conversationId = req.headers.get("x-conversation-id") ?? null;
  // const headers: any = {'Content-Type': 'multipart/form-data'};
  const headers: any = {
    'Content-Type': 'application/json', 
    'Content-Length': req.headers.get('content-length')
  };
  if (!!conversationId) {
    headers["X-Conversation-Id"] = conversationId;
  }

  return fetch(`${LANGCHAIN_SERVER_URL}/langchain/conversate`, {
    'method': "POST",
    'headers': headers,
    'body': await req.text(),
    'cache': "no-store"
  });
}
