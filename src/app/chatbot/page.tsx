import { fetchConversationHistory } from "@/lib/fetchConversationHistory";
import DescriptionWithFloatingButton from "./description-with-floating-button";

type Props = {
  searchParams: {uuid: string}
}

export default async function Home({ searchParams }: Props) {
  const { uuid } = searchParams;
  const { messages, conversationId } = await fetchConversationHistory(uuid);

  console.log(conversationId)

  return (
    <DescriptionWithFloatingButton messages={messages} conversationId={conversationId} />
  )
}
