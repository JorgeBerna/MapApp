// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6yNZIhav3pHqiVnBW2MCdsqQXkxqNmrw",
  authDomain: "mapapp-fa82e.firebaseapp.com",
  databaseURL: "https://mapapp-fa82e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mapapp-fa82e",
  storageBucket: "mapapp-fa82e.firebasestorage.app",
  messagingSenderId: "518520191033",
  appId: "1:518520191033:web:2b6d468a35906a308475e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };