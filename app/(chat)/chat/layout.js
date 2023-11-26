"use client"

import AuthUserButton from "@/components/AuthUserButton/AuthUserButton"
import ChatForms from "@/components/forms/chat-forms/ChatForms"
import supabase from "@/config/supabaseClient"
import axios from "axios"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const ChatPageLayout = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [chatList, setChatList] = useState([]);

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
        const fetchChatList = async () => {
            const { data, error } = await supabase
                .from('chats')
                .select()
                .eq('user_id', currentUser.id)

            if (error) {
                alert("something went wrong fetching your chats")
                console.log("error fetching smoothies : ", error);
            }

            if (data) {
                console.log('chat list : ', data)
                setChatList(data);
            }
        }
        if (currentUser) {
            fetchChatList();
        }
    }, [currentUser])

    return (
        <div className="w-full flex overflow-hidden">
            <div className="relative w-2/12 fixed left-0 top-0 h-screen bg-slate-800 text-gray-200 flex flex-col py-4">
                <div className="flex-grow px-4">
                    <Link href="/chat" className="flex items-center justify-between gap-x-2 hover:bg-gray-300/10 transition-all duration-300 ease-in-out rounded-md p-2">
                        <div className="flex items-center gap-x-2">
                            <Image src="/mindcase.jpg" width={30} height={30} className="rounded-full" />
                            <p className="text-gray-200">New Chat</p>
                        </div>
                        <ExternalLink />
                    </Link>

                    {
                        chatList.length > 0 && (
                            <div className="flex flex-col mt-12 gap-y-2 lg:h-[600px] xl:h-[700px] overflow-x-hidden overflow-y-auto">
                                {chatList.map((c) => (
                                    <Link href={`/chat/${c.id}`} className="p-2 hover:bg-gray-300/10">
                                        <p>{c.prompt.length > 25 ? c.prompt.slice(0, 25) + "..." : c.prompt}</p>
                                    </Link>
                                ))}
                            </div>
                        )
                    }
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-slate-800 text-white">
                    <div className="px-4 py-2">
                        <AuthUserButton currentUser={currentUser} />
                    </div>
                </div>
            </div>

            <div className="w-10/12 fixed top-0 right-0 h-screen overflow-y-auto bg-[#f6f6f6] pt-10">
                {children}
            </div>
        </div>
    )
}

export default ChatPageLayout