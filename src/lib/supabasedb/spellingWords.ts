import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export const supabaseDb = createClient<Database>(
    import.meta.env.VITE_ENV_supabaseUrl,
    import.meta.env.VITE_ENV_supabasekey
);

export async function getSpellingWordsFromSupabase(difficulty: string, maxrecords: number) {
    const response = await supabaseDb
        .from('random_words_view')
        .select('word,difficulty,definitionandexamplefor,partsofthespeech,definitionaudios,exampleaudios,etymologyaudios,wordaudios')
        .eq('difficulty', difficulty)
        .limit(maxrecords);

    return response.data;
}

export async function getSpellingWordsByListId(listId: string) {
    const response = await supabaseDb
        .from('user_word_list_words_vw')
        .select('*')
        .eq('list_id', listId);

    return response.data;
}