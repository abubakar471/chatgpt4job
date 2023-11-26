"use client"

import { Send } from "lucide-react"

const ChatForms = ({ currentUser, prompt, setPrompt, isGenerating, handleSubmit }) => {

    return (
        
        <form onSubmit={handleSubmit} className="flex items-center gap-x-2 w-full my-4 bg-white shadow-lg rounded-sm px-2">
            <input type="text" placeholder="Message ChatGPT4Job" disabled={isGenerating} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="grow p-4 outline-none" />
            <button type="submit" disabled={isGenerating}><Send /></button>
        </form>
    )
}

export default ChatForms