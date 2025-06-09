import { getSpellingWordsByListId, getSpellingWordsFromSupabase } from '$lib/supabasedb/spellingWords';

/** @type {import('./$types').PageLoad} */
export async function load({ params }: any) {
    console.log("Loading spelling words for slug:", params.slug);
    const slugIsGuid = isGuid(params.slug);
    console.log("Is slug a GUID?", slugIsGuid);
    if (slugIsGuid === false) {
        const difficulty = params.slug;
        const spellingWordsV2 = await getSpellingWordsFromSupabase(difficulty, 7);
        return {
            spellingDataV2: spellingWordsV2,
            difficultyLevel: difficulty,
            name: 'Random Words'            
        };
    }
    else {
        const listId = params.slug;
        console.log("Fetching spelling words for listId:", listId);
        const spellingWordsV2 = await getSpellingWordsByListId(listId);
        console.log("Spelling words for listId:", listId, spellingWordsV2);
        return {
            spellingDataV2: spellingWordsV2,
            difficultyLevel: '',
            name: spellingWordsV2[0].name
        };
    }
}

function isGuid(str: string) {
    const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return guidPattern.test(str);
}
