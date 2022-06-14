import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics'

const firebase = initializeApp(firebaseConfig)

export default firebase
