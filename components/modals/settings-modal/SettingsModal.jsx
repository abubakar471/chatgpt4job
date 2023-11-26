"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import supabase from "@/config/supabaseClient"
import { useRouter } from "next/navigation"
import { useState } from "react"

const SettingsModal = ({ currentUser }) => {
    const router = useRouter()
    const [active, setActive] = useState(1);

    const deleteChats = async () => {
        const { error } = await supabase
            .from('chats')
            .delete()
            .eq('user_id', currentUser.id);

        if (error) {
            console.log("Something Went Wrong While Deleting Chats. Please Try Again Later.", error);
        }
    }

    const deleteMessages = async () => {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('user_id', currentUser.id);

        if (error) {
            console.log("Something Went Wrong While Deleting Messages. Please Try Again Later.", error);
        }


    }
    const handleClearAll = async (e) => {
        e.preventDefault();

        try {
            deleteChats();
            deleteMessages();
        } catch (err) {
            console.log("error in handleClearAl  function", err);
        } finally {
            window.location.reload();
        }
    }

    const handleDeleteUser = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.admin.deleteUser(String(currentUser.id));
        if (error) {
            alert("Something went wrong while deleting your account");
            console.log(error)
        }

        if (data) {
            window.location.href = "/sign-up"
        }
    }

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-x-2 hover:bg-gray-300/10 w-full p-2 rounded-sm">
                <Settings /><span>Settings</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center">
                            <Settings size={50} />
                            <span>Settings</span>
                        </div>
                        <hr className="mt-2" />
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex gap-x-2 h-[100px] mt-4">
                            <div className="w-2/12 flex flex-col gap-y-2">
                                <div onClick={() => setActive(1)} className={`${active === 1 && "bg-gray-500/30"} hover:bg-gray-200 transition-all duration-150 ease-in-out text-center px-2 py-1 rounded-sm cursor-pointer`}>General</div>
                                <div onClick={() => setActive(2)} className={`${active === 2 && "bg-gray-500/30"} hover:bg-gray-200 transition-all duration-150 ease-in-out text-center px-2 py-1 rounded-sm cursor-pointer`}>Profile</div>
                            </div>

                            <div className="w-10/12 pl-4 flex items-center justify-between">
                                {active === 1 && (
                                    <>
                                        <p>Clear All Chat History</p>

                                        <form onSubmit={handleClearAll}>
                                            <button type="submit" className="p-2 rounded-md bg-red-600 text-white">Clear</button>
                                        </form>
                                    </>
                                )}


                                {active === 2 && (
                                    <>
                                        <p>Delete Account</p>

                                        <form onSubmit={handleDeleteUser}>
                                            <button type="submit" className="p-2 rounded-md bg-red-600 text-white">Delete</button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SettingsModal