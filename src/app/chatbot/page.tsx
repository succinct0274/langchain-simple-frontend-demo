import { fetchConversationHistory } from "@/lib/fetchConversationHistory";
import { z } from "zod";
import DescriptionWithFloatingButton from "./description-with-floating-button";
import { redirect } from "next/navigation";
const uuidS = z.string().uuid();
type Props = {
  searchParams: { uuid: string };
};

export default async function Home({ searchParams }: Props) {
  const { uuid } = searchParams;
  if (!uuidS.safeParse(uuid).success) {
    //redirect to chat page
    redirect("/chat");
  }
  const { messages, conversationId } = await fetchConversationHistory(uuid);

  //chat params is uuid or not

  return (
    <DescriptionWithFloatingButton
      messages={messages}
      conversationId={conversationId}
    />
  );
}
