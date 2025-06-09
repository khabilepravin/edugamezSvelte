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
            name: 'Random Words',
            total: spellingWordsV2.length            
        };
    }
    else {
        const listId = params.slug;
        const spellingWordsV2 = await getSpellingWordsByListId(listId);
        return {
            spellingDataV2: spellingWordsV2,
            difficultyLevel: '',
            name: spellingWordsV2[0].name,
            total: spellingWordsV2.length
        };
    }
}

function isGuid(str: string) {
    const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return guidPattern.test(str);
}
