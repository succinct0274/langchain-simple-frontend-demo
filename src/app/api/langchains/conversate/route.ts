import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';

export type ConversationResponse = {
    text: string,
    image: object[],
}

const LANGCHAIN_SERVER_URL = process.env.LANGCHAIN_SERVER_URL;
 
export async function POST(
  req: NextRequest,
//   res: NextApiResponse
) {
    const conversation_id = req.headers.get('x-conversation-id') ?? null;
    // const headers: any = {'Content-Type': 'multipart/form-data'};
    const headers: any = {}
    if (!!conversation_id) {
        headers['X-Conversation-Id'] = conversation_id;
    }

    const result = await fetch(`${LANGCHAIN_SERVER_URL}/langchains/conversate`, {
        method: 'POST',
        headers: headers,
        body: await req.formData(),
    })

    if (result.headers.get('x-conversation-id')) {
        headers['X-Conversation-Id'] = result.headers.get('x-conversation-id') as string
    }

    const json = await result.json();
    console.log(json);
    return NextResponse.json(json);
}
