import { error } from '@sveltejs/kit';
//import { getSpellingWordsV2 } from '../_api'; 
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_ENV_apiKey,
    authDomain: import.meta.env.VITE_ENV_authDomain,
    projectId: import.meta.env.VITE_ENV_projectId,
    storageBucket: import.meta.env.VITE_ENV_storageBucket,
    messagingSenderId: import.meta.env.VITE_ENV_messagingSenderId,
    appId: import.meta.env.VITE_ENV_appId
};

const app = initializeApp(firebaseConfig);

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const difficulty = params.slug;
    //setTimeout(()=>{ console.log('stuff');}, 4000);

   //return {};
    const spellingWordsV2 = await getSpellingWordsV2(difficulty);
    //console.log(JSON.stringify(spellingWordsV2));
    // .then(data =>{
    //     console.log(JSON.stringify(data));
    //     spellingWordsV2 = data;
    // });

    return {        
            spellingDataV2: spellingWordsV2        
    };
    // return {
       
    //         spellingDataV2: spellingWordsV2
       
    // };
//    return {
//        body: {
//            spellingDataV2: spellingWordsV2
//        }
//    };

//   if (params.slug === 'hello-world') {
//     return {
//       title: 'Hello world!',
//       content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
//     };
//   }
 
//   throw error(404, 'Not found');
}





async function getSpellingWordsV2(difficulty) {
    try
    {
     
        const db = getFirestore();
        const collectionRef = collection(db, "spellingwordsv2");
        
        const maxVal = await getSpellingWordsMaxIndexValue(difficulty);
        const rangeOfIndexes = getRandomNumbers(maxVal, 10);

        const q = query(collectionRef, where("Difficulty", "==", difficulty ? difficulty : "low"), where("RecordIndex", "in", rangeOfIndexes));

        const querySnapshot = await getDocs(q);

        const docsArray = [];

        // for(let i =0;i< 90000; i++){
        //     console.log(i);
        // }

        querySnapshot.forEach((doc) => {
            docsArray.push(doc.data());
        });

        return docsArray;
    }
    catch(error){
        console.error(error);
    }
}

async function getSpellingWordsMaxIndexValue(difficulty) {
    try
    {
        const db = getFirestore();
        
        const q = query(collection(db, "spellingwordsv2"), where("Difficulty", "==", difficulty ? difficulty : "low"), orderBy("RecordIndex", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs[0].data().RecordIndex;
    }
    catch(error){
        console.error(error);
    }
}


function getRandomNumbers(max, numberOfRandomWords) {
    let arr = [];
    while(arr.length < numberOfRandomWords){
        var r = Math.floor(Math.random() * max) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }

    return arr;
}