"use client"

import AuthUserButton from "@/components/AuthUserButton/AuthUserButton"
import ChatForms from "@/components/forms/chat-forms/ChatForms"
import ChatPageNavbar from "@/components/navbar/ChatPageNavbar"
import supabase from "@/config/supabaseClient"
import axios from "axios"
import { Edit, ExternalLink, History } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const ChatPageLayout = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [chatList, setChatList] = useState([]);

 

    return (
        <>
            <ChatPageNavbar />
            {children}
           
        </>
    )
}

export default ChatPageLayout