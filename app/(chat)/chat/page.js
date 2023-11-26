import Image from "next/image"

const ChatMainPage = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image src="/mindcase.jpg" width={80} height={80} alt="mindcase" className="rounded-md" />
            <h1 className="text-[30px] font-semibold">How Can I Help You Today?</h1>
        </div>
    )
}


export default ChatMainPage