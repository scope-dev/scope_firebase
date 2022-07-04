import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

import firebaseApp from '../firebaseInit';

let firebaseFunctions
const isEmulating = window.location.hostname === "localhost";
if (isEmulating) {
  firebaseFunctions = getFunctions(firebaseApp, 'us-central1');
  connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
}else{
  firebaseFunctions = getFunctions(firebaseApp, 'asia-northeast1');
}

export default firebaseFunctions;