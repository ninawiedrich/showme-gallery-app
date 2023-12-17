import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjj21TKghNwcU7bNLzo4JPVPoze-4bJ-U",
  authDomain: "showme-gallery.firebaseapp.com",
  projectId: "showme-gallery",
  storageBucket: "showme-gallery.appspot.com",
  messagingSenderId: "435869605643",
  appId: "1:435869605643:web:6e4b348a79cf42d21f8c0e"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db };