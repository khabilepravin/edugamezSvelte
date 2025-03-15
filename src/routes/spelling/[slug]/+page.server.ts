import { getSpellingWordsByListId, getSpellingWordsFromSupabase } from '$lib/supabasedb/spellingWords';

/** @type {import('./$types').PageLoad} */
export async function load({ params }: any) {
    if (isGuid(params.slug) === false) {
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
        const spellingWordsV2 = await getSpellingWordsByListId(listId);
        return {
            spellingDataV2: spellingWordsV2,
            difficultyLevel: '',
            name: spellingWordsV2[0].name
        };
    }
}

function isGuid(str:string) {
    const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return guidPattern.test(str);
}
