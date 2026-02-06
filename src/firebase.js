import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvJ0fKld8Y2ihDEp9ooyevSMIoJwpcU6c",
  authDomain: "cosmic-sheet.firebaseapp.com",
  projectId: "cosmic-sheet",
  storageBucket: "cosmic-sheet.firebasestorage.app",
  messagingSenderId: "668492404827",
  appId: "1:668492404827:web:0348edec95f25db88ac77e",
  measurementId: "G-FJE2SX90PH",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
