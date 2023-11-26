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

const SettingsModal = ({ currentUser }) => {
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
                        <div className="flex gap-x-2 items-center justify-items-start h-[100px] mt-4">
                            <div className="w-2/12">
                                <div className="bg-gray-500/30 text-center px-2 py-1 rounded-sm">General</div>
                            </div>

                            <div className="w-10/12 pl-4 flex items-center justify-between">
                                <p>Clear All Chat History</p>

                                <form onSubmit={handleClearAll}>
                                    <button type="submit" className="p-2 rounded-md bg-red-600 text-white">Clear</button>
                                </form>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SettingsModal