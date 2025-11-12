import { getSpellingWordsByListId, getSpellingWordsFromSupabase } from '$lib/supabasedb/spellingWords';

/** @type {import('./$types').PageLoad} */
export async function load({ params }: any) {
    console.log('🔍 Loading spelling data for slug:', params.slug);
    
    if (isGuid(params.slug) === false) {
        console.log('📚 Loading difficulty-based words for:', params.slug);
        const difficulty = params.slug;
        const spellingWordsV2 = await getSpellingWordsFromSupabase(difficulty, 7);
        console.log('✅ Loaded', spellingWordsV2?.length || 0, 'difficulty-based words');
        return {
            spellingDataV2: spellingWordsV2,
            difficultyLevel: difficulty,
            name: 'Random Words'
        };
    }
    else {
        console.log('📋 Loading custom list words for list ID:', params.slug);
        const listId = params.slug;
        const spellingWordsV2 = await getSpellingWordsByListId(listId);
        console.log('✅ Loaded', spellingWordsV2?.length || 0, 'custom list words');
        
        if (!spellingWordsV2 || spellingWordsV2.length === 0) {
            console.log('⚠️ No words found for list ID:', listId);
            return {
                spellingDataV2: [],
                difficultyLevel: '',
                name: 'Empty List'
            };
        }
        
        return {
            spellingDataV2: spellingWordsV2,
            difficultyLevel: '',
            name: spellingWordsV2[0]?.name || 'Custom List'
        };
    }
}

function isGuid(str:string) {
    const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return guidPattern.test(str);
}
