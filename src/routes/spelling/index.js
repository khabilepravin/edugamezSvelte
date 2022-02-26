import { getSpellingWords } from './_api';

export const get = async ({ locals }) => {
    const spellingWords = await getSpellingWords();
    
    const stringifiedWords = JSON.stringify(spellingWords);

    return {
        body:{
            message: stringifiedWords
        }
    };
}