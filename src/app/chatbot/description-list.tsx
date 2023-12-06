'use client'
import { useEffect, useState } from "react";

type Props = {
  conversationId: string,
  setConversationId: (arg: string) => void,
}

type FileWithDescription = {
  filename: string,
  upload_date: number,
  content_type: string,
}

export default function DescriptionList(props: Props) {
  const [conversationId, setConversationId] = useState(props.conversationId);
  const [filesWithDescription, setFilesWithDescription] = useState<FileWithDescription[]>([]);

  useEffect(() => {
    window.addEventListener('storage', () => {
      const res = sessionStorage.getItem('conversationId');
      if (res) setConversationId(res);
    })

    // setConversationId(sessionStorage.getItem('conversationId') as string);

    if (conversationId) {
      loadUploadedFiles(conversationId);
    }
  }, [])

  const loadUploadedFiles = (conversationId: string) => {
    return fetch(`/api/langchains/${conversationId}/files`)
      .then(res => res.json())
      .then(files => setFilesWithDescription(files));
  }

  const submitFiles = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e)
    console.log(e.target)

    const headers: any = {};
    if (conversationId) {
     headers['X-Conversation-Id'] = conversationId 
    }

    const formData = new FormData(e.target as HTMLFormElement);
    // const formProps = Object.fromEntries(formData)
    fetch('/api/langchains/files', {
      method: 'POST',
      headers,
      body: formData,
    })
    .then(res => {

      if (!res.headers.has('x-conversation-id')) {
        return Promise.reject("Unable to retrieve session id from backend server")
      }
      
      const conversationId = res.headers.get('x-conversation-id') as string;
      return loadUploadedFiles(conversationId);
    })
    .catch(message => window.alert(message));
  }

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Conversation</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Conversation details and uploaded files.</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Conversation Id</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{conversationId}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Attachments
              <form onSubmit={submitFiles} className="flex justify-between items-center	">
                <input style={{display: 'block', maxWidth: '10rem'}} multiple name="files" type="file" accept=".xlsx,.pdf"/>
                <button className="block border p-1 rounded-md" type="submit">Upload</button>
              </form>
            </dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {
                  filesWithDescription.map((fwd, idx) => (
                    <li key={idx} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <svg className="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
                        </svg>

                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">{fwd.filename}</span>
                        </div>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}