
export default {
    apiKey: import.meta.env.VITE_URL,
    authDomain: import.meta.env.VITE_FIB_AUTHDOMAIN,
    databaseURL: import.meta.env.VITE_FIB_FIRESTORE_URL,
    projectId: import.meta.env.VITE_FIB_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIB_STRG_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIB_MSG_ID
  };