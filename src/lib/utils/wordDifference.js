export function findExactDifference(actualWord, userSpelled){
    const actualWordArray = actualWord.split('');
    const userSpellingArray = userSpelled.split('');
    
    // v : represents the letter at the given position is same
    // - : represents a letter is missing in that location
    // x : represents the letter doesn't match with the original words'location

    const differenceArray = [];
    for(let i = 0; i < actualWordArray.length; i++){
        if(actualWordArray[i] === userSpellingArray[i]){
            differenceArray.push('v');
        }
        else if(userSpellingArray[i] === undefined){
            differenceArray.push('-');
        }
        else{
            differenceArray.push('x');
        }
    }
    
    return differenceArray;
}