"use client"
import ChatForms from "@/components/forms/chat-forms/ChatForms"
import supabase from "@/config/supabaseClient";
import SaveChats from "@/utils/save-chats";
import axios from "axios";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SingleChatPage = ({ params: { id } }) => {
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
                const savedChat = await SaveChats(prompt, currentUser);

                if (savedChat.length > 0) {
                    const { data, error } = await supabase.from("messages").insert([{ user_id: currentUser.id, chat_id: savedChat[0].id, messages: [...messages, userMessage, response.data] }]).select();

                    if (error) {
                        console.log(error);
                    }

                    if (data) {
                        console.log('saved messages : ', data);
                    }
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
                    .eq('chat_id', id);

                if (error) {
                    alert("something went wrong");
                    console.log(error);
                    router.push("/chat");
                }

                if (data) {
                    console.log("single page chat : ", data);
                    setMessages(data[0].messages);
                }
            }

            fetchMessages();
        }
    }, [currentUser])

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


export default SingleChatPage