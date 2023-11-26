import supabase from "@/config/supabaseClient";

export default async function SaveChats(prompt, currentUser) {
    const { data, error } = await supabase.from("chats").insert([{ prompt: prompt, user_id: String(currentUser.id) }]).select();

    if (error) {
        console.log(error);
        return;
    }

    if (data) {
        console.log(data);

        return data;
    }
}