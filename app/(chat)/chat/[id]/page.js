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

const SingleChatPage = ({ params: { id } }) => {
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

            setMessages((current) => [...current, userMessage, response.data]);
            setPrompt("");

            if (myMessage && myMessage.current) {
                myMessage.current.scrollTop = myMessage.current.scrollHeight;
            }

            if (response.data) {
                const { data, error } = await supabase.from("messages").update([{ messages: [...messages, userMessage, response.data] }]).eq('chat_id', id).select();

                if (error) {
                    console.log(error);
                }

                if (data) {
                    console.log('saved messages : ', data);
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

    useEffect(() => {
        if (currentUser) {
            const fetchMessages = async () => {
                const { data, error } = await supabase.from('messages')
                    .select()
                    .eq('chat_id', id)
                    .eq('user_id', currentUser.id);

                if (error) {
                    alert("something went wrong");
                    console.log(error);
                    router.push("/chat");
                }

                if (data.length > 0) {
                    console.log("single page chat : ", data);
                    setMessages(data[0].messages);
                } else {
                    router.push("/chat")
                }

            }

            fetchMessages();
        }
    }, [currentUser])

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
            <div className="flex flex-col w-[90%] md:w-[70%] lg:w-[50%] xl:w-[50%] mx-auto h-full">
                <div className="flex-grow">
                    {
                        messages.length > 0 && !isGenerating ? (
                            <div className="flex flex-col gap-y-4">
                                {
                                    messages.map((message, index) => (
                                        <MessageCard key={index} message={message} currentUser={currentUser} />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center">
                                {isGenerating && (
                                    <div className="h-full">
                                        <Loader />
                                    </div>
                                )
                                }
                            </div>
                        )
                    }
                </div>


                <div className="bg-[#f6f6f6] w-full">
                    <div className="flex items-center justify-center">
                        <ChatForms currentUser={currentUser} prompt={prompt} setPrompt={setPrompt} isGenerating={isGenerating} handleSubmit={handleSubmit} />
                    </div>
                </div>
                <div ref={myMessage} />
            </div>

        </>
    )
}


export default SingleChatPage