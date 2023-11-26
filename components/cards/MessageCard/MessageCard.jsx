import Image from "next/image"

const MessageCard = ({ message, currentUser }) => {
    console.log("message card : ", message)
    return (
        <div className="flex gap-x-2 min-h-[100px] bg-white rounded-md p-2 shadow-lg">
            {message.role === 'user' ? (
                <div className="bg-gray-500 rounded-full w-[40px] h-[40px] flex items-center justify-center uppercase text-white">
                    {currentUser.user_metadata.first_name[0]}{currentUser.user_metadata.last_name[0]}
                </div>
            ) : (
                <Image src="/mindcase.jpg" width={40} height={40} alt="role" className="rounded-full w-[40px] h-[40px]" />
            )}
            <p>{message.content}</p>
        </div>
    )
}


export default MessageCard