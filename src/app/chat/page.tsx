'use client';
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react";


export default function Home() {
  const basePath = '/chatbot';
  const [path, setPath] = useState<string>(basePath);
  const [state, setState] = useState({ conversationId: '' });
  const linkRef = useRef<HTMLAnchorElement>() as MutableRefObject<HTMLAnchorElement>;

  useEffect(() => {
    setPath(`${basePath}?uuid=${state.conversationId}`)
  }, [state])

  const handleConversationIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }

  const submitForm = (e: SubmitEvent) => {
    e.preventDefault();
    linkRef.current.click();
  }

  return (
    <div className="h-screen grid grid-rows-6 content-center">
      <Link ref={linkRef} className="hidden" href={path}></Link>
      <span className="w-full flex justify-center items-center row-start-3">
        <button type="button" onClick={() => linkRef.current.click() } className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Start a New Conversation</button>
      </span>
      <span className="w-full items-center row-start-4">
        <form className="flex justify-center gap-4 border-b" onSubmit={(e) => submitForm(e)}>
          <input name="conversationId" type="text" placeholder="Conversation ID" onChange={handleConversationIdChange} className="appearance-none bg-transparent border-none focus:outline-none" required></input>
          <button type="submit" className="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Continue Your Conversation</button>
        </form>
      </span>
    </div>
  );
}