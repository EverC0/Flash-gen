// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEoUFC_EFQQ8YNvMJM_uLApvAyzvoQBaM",
  authDomain: "flashcardsaas-9fdc0.firebaseapp.com",
  projectId: "flashcardsaas-9fdc0",
  storageBucket: "flashcardsaas-9fdc0.appspot.com",
  messagingSenderId: "975840251454",
  appId: "1:975840251454:web:cd1968164a0a6fc9b8cb6f",
  measurementId: "G-RK06H4EH0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}