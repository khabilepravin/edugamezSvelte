export function BuildADifferenceArray(actualWord, userSpelled){
    const actualWordArray = actualWord.split('');
    const userSpellingArray = userSpelled.split('');
    
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