import { NextRequest, NextResponse } from "next/server";

const LANGCHAIN_SERVER_URL = process.env.LANGCHAIN_SERVER_URL;

export async function GET(req: NextRequest, { params }: { params: { conversationId: string }}) {
  const { conversationId } = params;

  return fetch(`${LANGCHAIN_SERVER_URL}/langchains/${conversationId}/files`, {
    method: 'GET',
  });
}