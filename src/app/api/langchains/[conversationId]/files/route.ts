import { NextRequest, NextResponse } from "next/server";
const LANGCHAIN_SERVER_URL = process.env.LANGCHAIN_SERVER_URL;

export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const { conversationId } = params;
  console.log("[Files]", conversationId);
  const s = await fetch(
    `${LANGCHAIN_SERVER_URL}/langchains/${conversationId}/files`,
    {
      method: "GET",
      next: { revalidate: 0 },
    }
  );
  return NextResponse.json(await s.json());
}
