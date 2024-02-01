import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyDSthCVCRuMiFHh0xA1ioxWChsPq_dxJEI",
  authDomain: "videolibrary-demo.firebaseapp.com",
  projectId: "videolibrary-demo",
  storageBucket: "videolibrary-demo.appspot.com",
  messagingSenderId: "892735089369",
  appId: "1:892735089369:web:ba80a0b69ec4015b962cc8",
  measurementId: "G-TM5BK9JM61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth  = getAuth(app);
const provider = new GoogleAuthProvider();
const storage  = getStorage(app);
export {auth,provider,storage}
// const analytics = getAnalytics(app);