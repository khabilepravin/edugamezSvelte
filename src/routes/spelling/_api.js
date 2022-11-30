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

export async function getSpellingWords() {
    const db = getFirestore();

    const querySnapshot = await getDocs(collection(db, "spellingwords"));

    const docsArray = [];

    querySnapshot.forEach((doc) => {
        docsArray.push(doc.data());
    });

    return docsArray;
}


export async function getSpellingWordsV2(difficulty) {
    try
    {
        const db = getFirestore();
        const collectionRef = collection(db, "spellingwordsv2");
        
        const maxVal = await getSpellingWordsMaxIndexValue(difficulty);
        const rangeOfIndexes = getRandomNumbers(maxVal, 10);

        const q = query(collectionRef, where("Difficulty", "==", difficulty ? difficulty : "low"), where("RecordIndex", "in", rangeOfIndexes));

        const querySnapshot = await getDocs(q);

        const docsArray = [];

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