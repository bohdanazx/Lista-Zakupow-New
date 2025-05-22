import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCU43QERJKjVu4bksOggjMYapx4_QXvMZ4",
  authDomain: "lista-zakupow-987a2.firebaseapp.com",
  projectId: "lista-zakupow-987a2",
  storageBucket: "lista-zakupow-987a2.firebasestorage.app",
  messagingSenderId: "1027018502730",
  appId: "1:1027018502730:web:3557d939fedf4465826cb3",
  measurementId: "G-4HG2GD4FHN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
