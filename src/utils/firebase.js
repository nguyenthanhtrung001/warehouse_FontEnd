// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATrfQ1JZRN8DFZQZwgTVds2R3lLhgPipk",
  authDomain: "wasehouse-1d975.firebaseapp.com",
  projectId: "wasehouse-1d975",
  storageBucket: "wasehouse-1d975.appspot.com",
  messagingSenderId: "938945998972",
  appId: "1:938945998972:web:dc602211f13de3603b99f9",
  measurementId: "G-WHC1BF6PSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };
