import { getAuth, connectAuthEmulator } from "firebase/auth";

import firebaseApp from '../firebaseInit';

const firebaseAuth = getAuth(firebaseApp);

const isEmulating = window.location.hostname === "localhost";
if (isEmulating) {
  connectAuthEmulator(firebaseAuth, "http://localhost:9099");
}

export default firebaseAuth;