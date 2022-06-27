import { 
    doc,
    addDoc,
    collection,
    serverTimestamp,
    getDoc,
    getDocs } from "firebase/firestore";

import firebaseDb from './init';

export default {
    async getOne(table, id) {
        const neKeysRef = doc(firebaseDb, table, id);
        const docSnap = await getDoc(neKeysRef);
        if (docSnap.exists()) {
            //console.log(docSnap.data())
            return docSnap.data();
        } else {
            return false
        }
    }
}