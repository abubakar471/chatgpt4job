"use client"

import { Send } from "lucide-react"

const ChatForms = ({ currentUser, prompt, setPrompt, isGenerating, handleSubmit }) => {

    return (
        <div className="flex flex-col items-center justify-center gap-y-2 w-full">
            <form onSubmit={handleSubmit} className="flex items-center gap-x-2 w-full my-4 bg-white shadow-lg rounded-sm px-2">
                <input type="text" placeholder="Message ChatGPT4Job" disabled={isGenerating} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="grow p-4 outline-none" autoFocus />
                <button type="submit" disabled={isGenerating}><Send /></button>
            </form>
            <p className="text-sm text-gray-600 text-center pb-2">ChatGPT4Job can make mistakes. Consider checking important information.</p>
        </div>
    )
}

export default ChatForms