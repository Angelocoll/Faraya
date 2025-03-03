// Importera Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Din Firebase-konfiguration (hämta den från Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyB_MJHfOr56-6nORjyCdeYJSDDtN0pyajE",
  authDomain: "faraya-ad6af.firebaseapp.com",
  projectId: "faraya-ad6af",
  storageBucket: "faraya-ad6af.firebasestorage.app",
  messagingSenderId: "586581311204",
  appId: "1:586581311204:web:b610f6e800046fa80f76f1",
  measurementId: "G-GFS9XDBX8Y",
};

// Initialisera Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, ref, uploadBytesResumable, getDownloadURL };
