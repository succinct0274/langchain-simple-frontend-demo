"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { z } from "zod";
const uuid = z.string().uuid();
export default function Home() {
  const router = useRouter();
  const [state, setState] = useState({ conversationId: "", isUUID: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleConversationIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newState = {
      ...state,
      [e.target.name]: e.target.value,
      isUUID: false,
    };
    if (uuid.safeParse(e.target.value).success) {
      console.log("[Vaild]");
      newState.isUUID = true;
    }
    setState(newState);
  };

  const submitForm = (e: SubmitEvent) => {
    if (isLoading) {
      return;
    }
    e.preventDefault();
    router.push("/chatbot?uuid=" + state.conversationId);
  };

  //fetch initial messages
  const fetchInitialMessages = async () => {
    try {
      setIsLoading(true);
      const LANGCHAIN_SERVER_URL = process.env.NEXT_PUBLIC_LANGCHAIN_SERVER_URL;
      const res = await fetch(
        `${LANGCHAIN_SERVER_URL}/langchains/session/init`,
        {
          method: "POST",
        }
      );
      const result = await res.json();
      console.log(result);
      router.push("/chatbot?uuid=" + result.conversation_id);
    } catch (error) {
      console.error(error);
      window.alert(error?.toString());
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="m-auto grid md:flex gap-4 gap-y-4 flex-wrap">
        <div
          className="border rounded-lg w-[225px] h-[270px] bg-[#0042da] flex hover:scale-105 transition-all cursor-pointer"
          onClick={() => {
            if (isLoading) {
              return;
            }
            fetchInitialMessages();
          }}
        >
          {/* New Chat */}
          <p className="m-auto text-white font-bold">+ New Chat</p>
        </div>
        <div className="border border-black/30 rounded-lg w-[225px] h-[270px] bg-white flex">
          {/* Old Chat */}
          <form
            className="justify-center gap-3 my-auto mx-auto p-4 flex flex-col"
            onSubmit={(e) => submitForm(e)}
          >
            <input
              name="conversationId"
              type="text"
              placeholder="Conversation ID"
              onChange={handleConversationIdChange}
              className="appearance-none bg-transparent focus:outline-none my border p-1"
              required
            ></input>
            {/* Error text */}
            {!state.isUUID && state.conversationId.length != 0 ? (
              <p className="text-red-500 text-center">
                Please enter a valid UUID
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!state.isUUID || isLoading}
              className="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 disabled:cursor-not-allowed disabled:hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-40"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
