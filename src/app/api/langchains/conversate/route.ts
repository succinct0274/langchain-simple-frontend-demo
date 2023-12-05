// import type { NextApiRequest, NextApiResponse } from 'next'
// import { NextRequest, NextResponse } from 'next/server';

// export type ConversationResponse = {
//     text: string,
//     image: object[],
// }

// const LANGCHAIN_SERVER_URL = process.env.LANGCHAIN_SERVER_URL;

// export async function POST(
//   req: NextRequest,
// //   res: NextApiResponse
// ) {
//     const conversationId = req.headers.get('x-conversation-id') ?? null;
//     // const headers: any = {'Content-Type': 'multipart/form-data'};
//     const headers: any = {}
//     if (!!conversationId) {
//         headers['X-Conversation-Id'] = conversationId;
//     }

//     return fetch(`${LANGCHAIN_SERVER_URL}/langchains/conversate`, {
//         method: 'POST',
//         headers: headers,
//         body: await req.formData(),
//     });

// }
