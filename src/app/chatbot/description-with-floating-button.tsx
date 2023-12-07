import { MessageContent } from "@/type/chatbot";
import DescriptionList from "./description-list";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./chatbot"), {
  ssr: false,
});
type Props = {
  messages: MessageContent[];
  conversationId: string;
};

const DescriptionWithFloatingButton = (props: Props) => {
  const { messages, conversationId } = props;

  return (
    <>
      <div className="h-screen px-60 pt-20">
        <DescriptionList conversationId={conversationId} />
      </div>
      <DynamicComponentWithNoSSR
        initialMessages={messages}
        conversationId={conversationId}
      />
    </>
  );
};

export default DescriptionWithFloatingButton;
