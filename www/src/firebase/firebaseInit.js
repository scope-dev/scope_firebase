// import { initializeApp } from 'firebase/app';
// import firebaseConfig from './firebaseConfig';

// import 'firebase/auth'
// import 'firebase/firestore'
// import 'firebase/storage'
// import 'firebase/analytics'

// const firebase = initializeApp(firebaseConfig)

// export default firebase


import { getApps, getApp, initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import firebaseConfig from './firebaseConfig';

const firebase = initializeApp(firebaseConfig);

export const auth = () => { return getAuth() };
export const db = () => { return getFirestore(firebase) };
export const fb_functions = () => { return getFunctions(firebase) };
export const firebaseApp = () => { return firebase };

export default firebase;