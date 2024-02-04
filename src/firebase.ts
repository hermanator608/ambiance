// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Auth, getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// THESE ARE NOT SECRETS - THEY JUST IDENTIFY APP
export const firebaseConfig = {
  apiKey: "AIzaSyB9IfA30olKaxOPrjRNC_QjD0IxwtGp3UQ",
  authDomain: "ambiance-fa477.firebaseapp.com",
  projectId: "ambiance-fa477",
  storageBucket: "ambiance-fa477.appspot.com",
  messagingSenderId: "1021630573642",
  appId: "1:1021630573642:web:ae45f9e227c919a76a0ab3",
  measurementId: "G-1XGF9K5HWM"
};


export const initFirebase = (): void => {
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  getAuth(app);
  
  // Only start analytics in non-dev environments
  if (process.env.NODE_ENV !== 'development') {
    getAnalytics(app);
  }

}

