import { History } from "lucide-react"
import Link from "next/link"

const ChatList = ({ chatList }) => {
    return (
        chatList.length > 0 && (
            <>
                <div>
                    <h4 className="text-[14px] text-gray-400 p-2 flex items-cetner gap-x-2 mt-8">
                        <History size={20} />
                        <span>Previous Chats</span>
                    </h4>
                </div>
                <div className="flex flex-col justify-start gap-y-2 mt-8  lg:h-[600px] xl:h-[700px] overflow-x-hidden overflow-y-auto sidebar-scrollbar">
                    {chatList.map((c) => (
                        <Link href={`/chat/${c.id}`} className="p-2 hover:bg-gray-300/10">
                            <p>{c.prompt.length > 25 ? c.prompt.slice(0, 25) + "..." : c.prompt}</p>
                        </Link>
                    ))}
                </div>
            </>

        )

    )
}

export default ChatList