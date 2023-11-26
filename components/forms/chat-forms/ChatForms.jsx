"use client"

import axios from "axios";
import { Send } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react"

const ChatForms = ({ currentUser }) => {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const userMessage = {
                role: "user",
                content: prompt,
            };

            const newMessages = [...messages, userMessage];
            const response = await axios.post("/api/create-prompt", {
                messages: newMessages,
            });
            console.log(response.data);

            setMessages((current) => [...current, userMessage, response.data]);
            setPrompt("");
        } catch (error) {
            if (error?.response?.status === 403) {
                alert("you are unauthorized");
                console.log(error);
            } else {
                console.log(error);
            }
        } finally {
            setIsGenerating(false);
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-x-2 w-full my-4 bg-white shadow-lg rounded-sm px-2">
            <input type="text" placeholder="Message ChatGPT4Job" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="grow p-4 outline-none" />
            <button type="submit"><Send /></button>
        </form>
    )
}

export default ChatForms