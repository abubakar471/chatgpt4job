"use client"

import AuthUserButton from "@/components/AuthUserButton/AuthUserButton"
import ChatForms from "@/components/forms/chat-forms/ChatForms"
import supabase from "@/config/supabaseClient"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const ChatPageLayout = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

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
        <div className="w-full flex">
            <div className="w-2/12 fixed left-0 top-0 h-screen overflow-y-auto bg-slate-800 text-gray-200 flex flex-col px-4 py-4">
                <div className="flex-grow">
                    <Link href="/chat" className="flex items-center justify-between gap-x-2 hover:bg-gray-300/10 transition-all duration-300 ease-in-out rounded-md p-2">
                        <div className="flex items-center gap-x-2">
                            <Image src="/mindcase.jpg" width={30} height={30} className="rounded-full" />
                            <p className="text-gray-200">New Chat</p>
                        </div>
                        <ExternalLink />
                    </Link>
                </div>

                <div className="text-white">
                    <AuthUserButton currentUser={currentUser} />
                </div>
            </div>

            <div className="w-10/12 fixed top-0 right-0 h-screen overflow-y-auto bg-[#f6f6f6]">
                <div className="flex flex-col w-[50%] mx-auto h-full">
                    <div className="flex-grow">
                        {children}
                    </div>

                    <ChatForms currentUser={currentUser} />
                </div>

            </div>
        </div>
    )
}

export default ChatPageLayout