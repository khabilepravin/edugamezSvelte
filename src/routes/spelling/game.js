import { getSpellingWords, getSpellingWordsV2 } from './_api';
import { getRandomInt } from '../../lib/random';

export const get = async ({params, url}) => {
	//const spellingWords = await getSpellingWords();
	const difficulty = url.searchParams.get('difficulty');
	console.log(`Difficulty from the query string: ${difficulty}`);
	const spellingWordsV2 = await getSpellingWordsV2(difficulty);
	//let randomWordsForTest = getRandomWords(10, spellingWords);
	return {
		body: {
			spellingDataV2: spellingWordsV2
		}
	};
};

const getRandomWords = (numberOfRandomWords, allWords) => {
	let records = [];

	for (let i = 0; i < numberOfRandomWords; i++) {
		let randomIndex = getRandomInt(allWords.length - 1);
		records.push(allWords[randomIndex]);
	}

	return records;
};
