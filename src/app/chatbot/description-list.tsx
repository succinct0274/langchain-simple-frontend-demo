"use client";
import { useCallback, useEffect, useState } from "react";

type Props = {
  conversationId: string;
};

type FileWithDescription = {
  filename: string;
  upload_date: number;
  content_type: string;
};

export default function DescriptionList({ conversationId }: Props) {
  const [filesWithDescription, setFilesWithDescription] = useState<
    FileWithDescription[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const loadUploadedFiles = useCallback(async () => {
    const res = await fetch(`/api/langchains/${conversationId}/files`, {
      method: "GET",
      next: {
        revalidate: 0,
      },
    });
    console.log(res.body);
    const data = await res.json();
    console.log(data);
    setFilesWithDescription(data ?? []);
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      console.log(conversationId);
      loadUploadedFiles();
    }
  }, [conversationId, loadUploadedFiles]);

  const submitFiles = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    console.log(e.target);

    const headers: any = {};
    if (conversationId) {
      headers["X-Conversation-Id"] = conversationId;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    // const formProps = Object.fromEntries(formData)
    setLoading(true);
    fetch("/api/langchains/files", {
      method: "POST",
      headers,
      body: formData,
    })
      .then((res) => {
        if (!res.headers.has("x-conversation-id")) {
          return Promise.reject(
            "Unable to retrieve session id from backend server"
          );
        }

        loadUploadedFiles();
      })
      .catch((message) => window.alert(message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Conversation
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Conversation details and uploaded files.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Conversation Id
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {conversationId}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Attachments
              <form
                onSubmit={submitFiles}
                className="flex justify-between items-center	"
              >
                <input
                  style={{ display: "block", maxWidth: "10rem" }}
                  multiple
                  name="files"
                  type="file"
                  accept=".xlsx,.pdf"
                />
                <button className="block border p-1 rounded-md" type="submit">
                  {
                    !loading ? 
                    'Upload' : 
                    (
                      <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )
                  }
                </button>
              </form>
            </dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                {filesWithDescription.map((fwd, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          {fwd.filename}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
