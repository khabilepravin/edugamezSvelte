import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_ENV_apiKey,
    authDomain: import.meta.env.VITE_ENV_authDomain,
    projectId: import.meta.env.VITE_ENV_projectId,
    storageBucket: import.meta.env.VITE_ENV_storageBucket,
    messagingSenderId: import.meta.env.VITE_ENV_messagingSenderId,
    appId: import.meta.env.VITE_ENV_appId
  };

  const app = initializeApp(firebaseConfig);

  export async function getSpellingWords(){
        const db = getFirestore();

        const querySnapshot = await getDocs(collection(db, "spellingwords"));

        const docsArray = [];

        querySnapshot.forEach((doc) => {
            docsArray.push(doc.data());
        });

        return docsArray;
  }
