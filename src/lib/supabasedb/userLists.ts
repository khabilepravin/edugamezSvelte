import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export const supabaseDb = createClient<Database>(
    import.meta.env.VITE_ENV_supabaseUrl,
    import.meta.env.VITE_ENV_supabasekey
);

export async function getAllUserListsByUserId(userId:string) {
    const result = await supabaseDb
                        .from('user_word_lists_vw')
                        .select('*')
                        .eq("user_id", userId)
                        .returns<any[]>();

    return result.data;
}