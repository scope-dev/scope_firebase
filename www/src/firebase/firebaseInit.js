import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import firebaseApp from "firebase/app"

export const firebase = () => {firebaseApp.initializeApp(firebaseConfig)}
export const projectAuth = () => {firebase.auth()}
export const projectFirestore = () => {firebase.firestore()}
export const timestamp = () => {firebase.firestore.FieldValue.serverTimestamp}
