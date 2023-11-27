"use client"
import Loader from "@/components/Loader/Loader";
import MessageCard from "@/components/cards/MessageCard/MessageCard";
import ChatForms from "@/components/forms/chat-forms/ChatForms"
import supabase from "@/config/supabaseClient";
import SaveChats from "@/utils/save-chats";
import axios from "axios";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ChatMainPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();
    const myMessage = useRef(null);

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

            if (response.data) {
                const savedChat = await SaveChats(prompt, currentUser);

                if (savedChat.length > 0) {
                    const { data, error } = await supabase.from("messages").insert([{ user_id: currentUser.id, chat_id: savedChat[0].id, messages: [...messages, userMessage, response.data] }]).select();

                    if (error) {
                        console.log(error);
                    }

                    if (data) {
                        router.push(`/chat/${savedChat[0].id}`);
                    }
                }
            }
            setPrompt("");
            if (myMessage && myMessage.current) {
                myMessage.current.scrollTop = myMessage.current.scrollHeight;
            }


        } catch (error) {
            if (error?.response?.status === 403) {
                alert("you are unauthorized");
                console.log(error);
                setIsGenerating(false);
            } else {
                console.log(error);
                setIsGenerating(false);
            }
        }
    };


    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log("current user : ", user);
            if (user) {
                setCurrentUser(user);
            } else {
                router.push("/sign-in");
            }
        }

        fetchUser();
    }, []);

    useEffect(() => {
        if (messages.length) {
            myMessage.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            })
        }
    }, [messages.length])

    return (
        <>
            <div className="relative flex flex-col w-[90%] md:w-[70%] lg:w-[50%] xl:w-[50%] mx-auto h-full ">
                <div className="flex-grow">
                    {
                        (messages.length > 0 && !isGenerating) ? (
                            <div className="flex flex-col gap-y-4">
                                {
                                    messages.map((message, index,) => (
                                        <MessageCard key={index} message={message} currentUser={currentUser} />
                                    ))
                                }
                            </div>
                        ) : (

                            isGenerating ? (
                                <div className="h-full">
                                    <Loader />
                                </div>
                            ) : (
                                < div className="h-full flex flex-col items-center justify-center">
                                    <Image src="/mindcase.jpg" width={80} height={80} alt="mindcase" className="rounded-md" />
                                    <h1 className="text-[30px] font-semibold">How Can I Help You Today?</h1>
                                </div>
                            )
                        )
                    }

                </div>

                <div className="bg-[#f6f6f6] w-full">
                    <div className="flex items-center justify-center">
                        <ChatForms currentUser={currentUser} prompt={prompt} setPrompt={setPrompt} isGenerating={isGenerating} handleSubmit={handleSubmit} />
                    </div>
                </div>

                <div ref={myMessage} />
            </div >

        </>
    )
}


export default ChatMainPage