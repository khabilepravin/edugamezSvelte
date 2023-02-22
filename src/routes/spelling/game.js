import { getSpellingWordsV2 } from './_api';
import { getRandomInt } from '../../lib/random';

export const get = async ({params, url}) => {
	 const difficulty = url.searchParams.get('difficulty');	
	const spellingWordsV2 = await getSpellingWordsV2(difficulty);

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
