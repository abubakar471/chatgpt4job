"use client"

import supabase from "@/config/supabaseClient";
import { CircleUser, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react"
import SettingsModal from "../modals/settings-modal/SettingsModal";

const AuthUserButton = ({ currentUser }) => {
    const [open, setOpen] = useState(false);
    const [openSsttings, setOpenSettings] = useState(false);
    const router = useRouter();

    const handleSignOut = async (e) => {
        e.preventDefault();

        try {
            let { error } = await supabase.auth.signOut();

            if (!error) {
                router.push("/");
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            {currentUser && (
                <>
                    {
                        open && (
                            <section className="pb-2">
                                <div className="bg-slate-700 text-gray-300 bottom-12 left-0 w-full shadow-lg rounded-md flex flex-col gap-y-2 z-50 p-2">
                                    <SettingsModal currentUser={currentUser} />
                                    <form onSubmit={handleSignOut}>
                                        <button type="submit" className="flex items-center gap-x-2 hover:bg-gray-300/10 w-full p-2 rounded-sm"><LogOut /><span>Sign Out</span></button>
                                    </form>
                                </div>
                            </section>
                        )
                    }

                    <div onClick={() => setOpen(!open)} className="flex items-center gap-x-2 hover:bg-gray-300/10 transition-all duration-300 ease-in-out rounded-md p-2 cursor-pointer">
                        <div className="flex items-center gap-x-2" >
                            <CircleUser />
                            <p>
                                {`${currentUser.user_metadata.first_name} ${currentUser.user_metadata.last_name} `}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default AuthUserButton