import { getSpellingWords } from './_api';
import { getRandomInt } from '../../lib/random';

export const get = async ({ locals }) => {
	const spellingWords = await getSpellingWords();

	let randomWordsForTest = getRandomWords(10, spellingWords);
	return {
		body: {
			spellingData: randomWordsForTest
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
