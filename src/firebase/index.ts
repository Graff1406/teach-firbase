import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3L8M4gYQuOvPe5piASQYsbXMXWCkAd0o",
  authDomain: "fir-test-7d61f.firebaseapp.com",
  projectId: "fir-test-7d61f",
  storageBucket: "fir-test-7d61f.appspot.com",
  messagingSenderId: "838473282082",
  appId: "1:838473282082:web:dfd03f07fba7d6f3ab107b",
};

export const app = initializeApp(firebaseConfig);

const database = getFirestore(app);

export default database;