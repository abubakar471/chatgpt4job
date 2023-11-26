"use client"

import { AlignLeft, Edit, } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ChatMobileSidebar from "../sidebar/chat-mobile-sidebar/ChatMobileSidebar";

const ChatPageNavbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="z-50 fixed top-0 w-full left-0 flex items-center justify-between lg:hidden xl:hidden bg-white text-black p-2">
            <div className="cursor-pointer" onClick={() => setOpen(!open)}>
                <AlignLeft />
            </div>

            <Link href="/chat">
                New Chat
            </Link>

            <Link href="/chat">
                <Edit />
            </Link>

            {open && (
                <ChatMobileSidebar open={open} setOpen={setOpen} />
            )}

        </nav>
    )
}

export default ChatPageNavbar;