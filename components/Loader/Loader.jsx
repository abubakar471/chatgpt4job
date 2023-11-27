import Image from "next/image"

const Loader = () => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="w-[200px] h-[200px] rounded-md p-2 flex flex-col items-center justify-center">
                <Image src="/loading.gif" width={50} height={50} alt="mindcase" className="rounded-md mb-2" />
                <h1 className="text-[20px] font-semibold">Just A Moment</h1>
            </div>
        </div>
    )
}

export default Loader