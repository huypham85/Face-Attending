// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {getAuth} from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCAU5h5-8nRKV2IeHlolL0uA-HiqHUjgA",
  authDomain: "face-attendance-470c2.firebaseapp.com",
  databaseURL: "https://face-attendance-470c2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "face-attendance-470c2",
  storageBucket: "face-attendance-470c2.appspot.com",
  messagingSenderId: "468041328147",
  appId: "1:468041328147:web:613abae729034d6e5b01e6",
  measurementId: "G-3VSM3EG221"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
export const auth = getAuth(app);
export default database;