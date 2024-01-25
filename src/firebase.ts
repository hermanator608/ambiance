// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; 

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// THESE ARE NOT SECRETS - THEY JUST IDENTIFY APP
const firebaseConfig = {
  apiKey: "AIzaSyB9IfA30olKaxOPrjRNC_QjD0IxwtGp3UQ",
  authDomain: "ambiance-fa477.firebaseapp.com",
  projectId: "ambiance-fa477",
  storageBucket: "ambiance-fa477.appspot.com",
  messagingSenderId: "1021630573642",
  appId: "1:1021630573642:web:ae45f9e227c919a76a0ab3",
  measurementId: "G-1XGF9K5HWM"
};

export const initFirebase = async(): Promise<void> => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Only start analytics in non-dev environments
  if (process.env.NODE_ENV !== 'development') {
    getAnalytics(app);
  }

  // Initialize Firestore DB
  const db = getFirestore(app);

  //Test DB connection with read 
  try {
    const querySnapshot = await getDocs(collection(db, "testing"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });

  } catch (e) {
    console.error("Error reading document: ", e);
  }
  
}


