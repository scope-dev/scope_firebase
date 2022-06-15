import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import firebaseApp from '../firebaseInit';

const firebaseDb = getFirestore(firebaseApp);

const isEmulating = window.location.hostname === "localhost";
if (isEmulating) {
  connectFirestoreEmulator(firebaseDb, 'localhost', 8080);
}

export default firebaseDb;