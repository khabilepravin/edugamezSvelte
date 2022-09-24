import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";


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
        
        const q = query(collection(db, "spellingwordsv2"), where("Difficulty", "==", difficulty ? difficulty : "low"));
        const querySnapshot = await getDocs(q);

        const docsArray = [];

        querySnapshot.forEach((doc) => {
            docsArray.push(doc.data());
        });
        console.log(`Number of records are: ${docsArray.length}`);
        return docsArray;
    }
    catch(error){
        console.error(error);
    }
}