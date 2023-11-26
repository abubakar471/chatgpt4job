"use client"

import supabase from "@/config/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUpPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

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
            alert("Something Went Wrong! Try Again Later.");
            console.log(error)
        }

        if (data) {
            console.log(data);

            router.push("/account/confirm-email");
        }
    }
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
                    <h1 className="text-center text-[20px] text-slate-500 mb-5">Sign up for a new MindCase Account</h1>
                    <input type="text" placeholder="First Name" className="p-4 outline-none border w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input type="text" placeholder="Last Name" className="p-4 outline-none border w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input type="email" placeholder="E-mail" className="p-4 outline-none border w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Password" className="p-4 outline-none border w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="p-4 w-full rounded-sm bg-slate-500 hover:bg-slate-800 text-white text-center transition-all duration-300 ease-in-out mb-4">Sign Up</button>
                </form>
            </div>
        </>
    )
}

export default SignUpPage;