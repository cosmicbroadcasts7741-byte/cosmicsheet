import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvJ0fKld8Y2ihDEp9ooyevSMIoJwpcU6c",
  authDomain: "cosmic-sheet.firebaseapp.com",
  projectId: "cosmic-sheet",
  storageBucket: "cosmic-sheet.appspot.com", // ✅ FIXED
  messagingSenderId: "668492404827",
  appId: "1:668492404827:web:0348edec95f25db88ac77e",
  measurementId: "G-FJE2SX90PH",
};

// ✅ Initialize app FIRST
const app = initializeApp(firebaseConfig);

// ✅ THEN export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
