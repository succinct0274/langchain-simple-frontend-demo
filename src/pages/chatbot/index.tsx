import { DeepChat } from "deep-chat-react";

export default function Home() {
  const initialMessages = [
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" }
  ]

  return (
    <>
      <h1>Hello world</h1>
      <DeepChat demo={true} 
        style={{ borderRadius: "10px" }}
        textInput={{ placeholder: { text: "Welcome to the demo!" } }}
        initialMessages={initialMessages} />
    </>
  )
}
