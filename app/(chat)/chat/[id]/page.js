"use client"
import AuthUserButton from "@/components/AuthUserButton/AuthUserButton";
import ChatList from "@/components/ChatList/ChatList";
import Loader from "@/components/Loader/Loader";
import MessageCard from "@/components/cards/MessageCard/MessageCard";
import ChatForms from "@/components/forms/chat-forms/ChatForms"
import supabase from "@/config/supabaseClient";
import SaveChats from "@/utils/save-chats";
import axios from "axios";
import { Edit } from "lucide-react";
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SingleChatPage = ({ params: { id } }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();
    const myMessage = useRef(null);

    const fetchChatList = async () => {
        const { data, error } = await supabase
            .from('chats')
            .select()
            .eq('user_id', currentUser.id).order('created_at', { ascending: false })

        if (error) {
            alert("something went wrong fetching your chats")
            console.log("error fetching smoothies : ", error);
        }

        if (data) {
            console.log('chat list : ', data)
            setChatList(data);
        }
    }

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
                    fetchChatList();
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
        if (currentUser) {
            fetchChatList();
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
            <div className="w-2/12  fixed left-0 top-0 h-screen bg-slate-800 text-gray-200 hidden lg:flex xl:flex flex-col py-4">
                <div className="flex-grow px-4">
                    <Link href="/chat" className="flex items-center justify-between gap-x-2 hover:bg-gray-300/10 transition-all duration-300 ease-in-out rounded-md p-2">
                        <div className="flex items-center gap-x-2">
                            <Image src="/mindcase.jpg" width={30} height={30} className="rounded-full" />
                            <p className="text-gray-200">New Chat</p>
                        </div>
                        <Edit />
                    </Link>

                    {/* chatlist */}
                    <ChatList chatList={chatList} />
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-slate-800 text-white">
                    <div className="px-4 py-2">
                        <AuthUserButton currentUser={currentUser} />
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-10/12 xl:w-10/12 fixed top-0 right-0 h-screen overflow-y-auto bg-[#f6f6f6] pt-14">
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
            </div>
        </>
    )
}


export default SingleChatPage