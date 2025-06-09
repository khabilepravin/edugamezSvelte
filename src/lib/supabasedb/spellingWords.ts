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

    if (response.data) {
        // Fisher-Yates (aka Knuth) Shuffle
        let array = response.data;
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    return response.data;
}