// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8-B0wjOI0CUEIJiNXHU0nuJxSYNvS7_g",
  authDomain: "proyectofirebase-3f344.firebaseapp.com",
  projectId: "proyectofirebase-3f344",
  storageBucket: "proyectofirebase-3f344.firebasestorage.app",
  messagingSenderId: "428974190150",
  appId: "1:428974190150:web:ec5c272dbaa947d20b6447",
  measurementId: "G-7CT09X7ZPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
