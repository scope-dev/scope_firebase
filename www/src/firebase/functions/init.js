import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

import firebaseApp from '../firebaseInit';

const firebaseFunctions = getFunctions(firebaseApp);

const isEmulating = window.location.hostname === "localhost";
if (isEmulating) {
  connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
}

export default firebaseFunctions;