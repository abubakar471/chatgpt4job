import Image from "next/image"

const ConfirmEmailPage = () => {
    return (
        <>
            <div className="w-full h-screen flex items-center justify-center">

                <form className="w-[600px] rounded-md shadow-lg p-4 flex flex-col gap-y-2">
                    <div className="w-full flex items-center justify-center">
                        <Image src={"/mindcase.jpg"}
                            width={60}
                            height={60}
                            alt='mindcase'
                            className="rounded-lg"
                        />
                    </div>
                    <h1 className="text-center text-[20px] text-slate-500 mb-5">Your account has been created. Please check your inbox to verify your email.</h1>

                    <a href="https://mail.google.com/" className="p-4 w-full rounded-sm bg-slate-500 hover:bg-slate-800 text-white text-center transition-all duration-300 ease-in-out">Check your inbox</a>
                </form>
            </div>
        </>
    )
}


export default ConfirmEmailPage