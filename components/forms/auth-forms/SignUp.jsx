"use client"

import supabase from "@/config/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignUpForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        })



        if (error) {
            setFormError(error.message);
            console.log(error)
        }

        if (data) {
            console.log(data);

            router.push("/account/confirm-email");
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

                <form onSubmit={handleSubmit} className="w-[450px] md:w-[600px] lg:w-[600px] xl:w-[600px] rounded-md shadow-lg p-4 flex flex-col gap-y-2">
                    <div className="w-full flex items-center justify-center">
                        <Image src={"/mindcase.jpg"}
                            width={60}
                            height={60}
                            alt='mindcase'
                            className="rounded-lg"
                        />
                    </div>
                    <h1 className="text-center text-[20px] text-slate-500 mb-5">Sign up for a new MindCase Account</h1>
                    <input type="text" placeholder="First Name" className="p-4 outline-none border w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input type="text" placeholder="Last Name" className="p-4 outline-none border w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input type="email" placeholder="E-mail" className="p-4 outline-none border w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Password" className="p-4 outline-none border w-full" value={password} onChange={(e) => setPassword(e.target.value)} />

                    {formError && (
                        <p className="text-red-400 font-semibold">{formError}</p>
                    )}

                    <button type="submit" className="p-4 w-full rounded-sm bg-slate-500 hover:bg-slate-800 text-white text-center transition-all duration-300 ease-in-out" disabled={isLoading}>
                        {isLoading ? "Please wait..." : "Sign Up"}
                    </button>

                    <div className="flex items-center justify-center text-black">
                        <p>Already have an account | <Link href="/sign-in" className="underline">Sign In Instead</Link></p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignUpForm;