"use client"

import AuthUserButton from "@/components/AuthUserButton/AuthUserButton"
import supabase from "@/config/supabaseClient"
import { Edit, History } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const ChatMobileSidebar = ({ open, setOpen }) => {
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
        <div className="bg-gray-500/20 w-full h-screen fixed top-10 left-0 z-50">
            <div className="bg-slate-700 w-[350px] h-full py-4">
                <div className="w-full flex flex-col overflow-hidden relative">

                    <div className="grow px-4 h-full">
                        <Link onClick={() => setOpen(false)} href="/chat" className="flex items-center justify-between gap-x-2 hover:bg-gray-300/10 transition-all duration-300 ease-in-out rounded-md p-2">
                            <div className="flex items-center gap-x-2">
                                <Image src="/mindcase.jpg" width={30} height={30} className="rounded-full" />
                                <p className="text-gray-200">New Chat</p>
                            </div>
                            <Edit className="text-gray-200" />
                        </Link>



                        {
                            chatList.length > 0 && (
                                <div className="flex flex-col mt-12 gap-y-2 lg:h-[600px] xl:h-[700px] overflow-x-hidden overflow-y-auto">
                                    <h4 className="text-[14px] text-gray-400 p-2 flex items-cetner gap-x-2">
                                        <History size={20} />
                                        <span>Previous Chats</span>
                                    </h4>
                                    {chatList.map((c) => (
                                        <Link onClick={() => setOpen(false)} href={`/chat/${c.id}`} className="p-2 hover:bg-gray-300/10 text-white">
                                            <p>{c.prompt.length > 25 ? c.prompt.slice(0, 25) + "..." : c.prompt}</p>
                                        </Link>
                                    ))}
                                </div>
                            )
                        }

                        <div className="fixed bottom-2 text-white z-50">
                            <div className="px-2 py-2">
                                <AuthUserButton currentUser={currentUser} />
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default ChatMobileSidebar