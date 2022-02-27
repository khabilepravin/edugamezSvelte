import { getSpellingWords } from './_api';

export const get = async ({ locals }) => {
    const spellingWords = await getSpellingWords();
    
    let randomWordsForTest = getRandomWords(10, spellingWords);
    return {
        body:{
            spellingData: randomWordsForTest
        }
    };
}

const getRandomWords = (numberOfRandomWords, allWords) => {    
    let records = [];
    // for (let i = 0; i < numberOfRandomWords; i++) {
    //   recordIndexes.push(getRandomInt((allWords.length-1)));
    // }
  
    for(let i=0; i< numberOfRandomWords; i++){
        let randomIndex = getRandomInt((allWords.length-1));
        records.push(allWords[randomIndex]);
    }

    return records;
}

 
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}