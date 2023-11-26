"use client"

import supabase from "@/config/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignInForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            let { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })


            if (error) {
                setFormError(error.message);
            }

            if (data.user) {
                setFormError(null);
                console.log(data);
                router.push("/chat");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log("current user : ", user);
            if (user) {
                window.location.href = "/chat"
            }
        }

        fetchUser();
    }, []);


    return (
        <>
            <div className="w-full h-screen flex items-center justify-center">

                <form onSubmit={handleSubmit} className="w-[600px] rounded-md shadow-lg p-4 flex flex-col gap-y-2">
                    <div className="w-full flex items-center justify-center">
                        <Image src={"/mindcase.jpg"}
                            width={60}
                            height={60}
                            alt='mindcase'
                            className="rounded-lg"
                        />
                    </div>
                    <h1 className="text-center text-[20px] text-slate-500 mb-5">Sign in with your MindCase Account</h1>
                    <input type="email" placeholder="E-mail" className="p-4 outline-none border w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Password" className="p-4 outline-none border w-full" value={password} onChange={(e) => setPassword(e.target.value)} />

                    {formError && (
                        <p className="text-red-400 font-semibold">{formError}</p>
                    )}

                    <button type="submit" className="p-4 w-full rounded-sm bg-slate-500 hover:bg-slate-800 text-white text-center transition-all duration-300 ease-in-out" disabled={isLoading}>
                        {isLoading ? "Please wait..." : "Sign In"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default SignInForm;