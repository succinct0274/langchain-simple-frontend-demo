'use clent'
import { RefObject, useState } from 'react'
import '../globals.css'

type Props = {
  toggleCloseButton: () => void,
  style: any
}

export default function ChatbotHeader({ toggleCloseButton, style }: Props) {

  return (
    <div className='flex justify-end bg-white' style={{...style, border: '1px solid rgb(202,202,202)', borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}>
      <button 
        type="button" 
        className="bg-white rounded-md p-2 inline-flex items-center justify-end text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={() => toggleCloseButton()}
      >
        <span className="sr-only">Close menu</span>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}