import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(import.meta.env.VITE_ENV_supabaseUrl, import.meta.env.VITE_ENV_supabasekey);

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const difficulty = params.slug;
    const spellingWordsV2 = await getSpellingWordsFromSupabase('low',7);
    return {        
            spellingDataV2: spellingWordsV2,
            difficultyLevel: difficulty        
    };
}

async function getSpellingWordsFromSupabase(difficulty, maxrecords){
    const response = await _supabase
    .from('random_words_view')
    .select('word,difficulty,definitionandexamplefor,partsofthespeech,definitionaudios,exampleaudios,etymologyaudios,wordaudios')
    .eq('difficulty', difficulty)    
    .limit(maxrecords);

    return response.data;
}
