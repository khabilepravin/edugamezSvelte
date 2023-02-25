import { getSpellingWordsV2 } from './_api';
import { getRandomInt } from '../../lib/random';

export const get = async ({params, url}) => {
	 const difficulty = url.searchParams.get('difficulty');	
	 setTimeout(()=>{ console.log('stuff');}, 4000);
	const spellingWordsV2 = await getSpellingWordsV2(difficulty);

	return {
		body: {
			spellingDataV2: spellingWordsV2
		}
	};
};
