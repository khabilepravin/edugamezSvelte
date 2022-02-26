import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";



  const app = initializeApp(firebaseConfig);

  export async function getSpellingWords(){
        const db = getFirestore();

        const querySnapshot = await getDocs(collection(db, "spellingwords"));

        console.log(querySnapshot);

        return querySnapshot;
  }

// export function something(){
//     return "Hello";
// }