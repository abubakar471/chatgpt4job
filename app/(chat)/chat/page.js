"use client"
import ChatForms from "@/components/forms/chat-forms/ChatForms"
import supabase from "@/config/supabaseClient";
import axios from "axios";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ChatMainPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
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

            if (response.data) {
                const { data, error } = await supabase.from("chats").insert([{ prompt: prompt, user_id: String(currentUser.id) }]);

                if (error) {
                    console.log(error);
                }

                if (data) {
                    console.log(data);
                }
            }
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


    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log("current user : ", user);
            if (user) {
                setCurrentUser(user);
            }
        }

        fetchUser();
    }, []);

    return (
        <>
            <div className="flex flex-col w-[50%] mx-auto h-full">
                <div className="flex-grow">
                    {
                        messages.length > 0 ? (
                            <div className="flex flex-col gap-y-4">
                                {
                                    messages.map((message) => (
                                        <div className="flex gap-x-2 bg-white rounded-md p-2 shadow-lg">
                                            {message.role === 'user' ? (
                                                <div className="bg-gray-500 rounded-full w-[40px] h-[40px] flex items-center justify-center uppercase text-white">
                                                    {currentUser.user_metadata.first_name[0]}{currentUser.user_metadata.last_name[0]}
                                                </div>
                                            ) : (
                                                <Image src="/mindcase.jpg" width={40} height={40} alt="role" className="rounded-full" />
                                            )}
                                            <p>{message.content}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center">
                                <Image src="/mindcase.jpg" width={80} height={80} alt="mindcase" className="rounded-md" />
                                <h1 className="text-[30px] font-semibold">How Can I Help You Today?</h1>
                            </div>
                        )
                    }
                </div>

                <ChatForms currentUser={currentUser} prompt={prompt} setPrompt={setPrompt} isGenerating={isGenerating} handleSubmit={handleSubmit} />
            </div>

        </>
    )
}


export default ChatMainPage