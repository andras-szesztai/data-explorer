import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyBud5qj3-rsA9jlsxp8knc4Psb9EH62KlE',
  authDomain: 'justice-and-peace-samen-hier.firebaseapp.com',
  databaseURL: 'https://justice-and-peace-samen-hier.firebaseio.com',
  projectId: 'justice-and-peace-samen-hier',
  storageBucket: 'justice-and-peace-samen-hier.appspot.com',
  messagingSenderId: '10960014980',
  appId: '1:10960014980:web:f47d968db2270ea8467cd1',
  measurementId: 'G-KSYDY49WE0'
}
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
// firebase.settings({ timestampsIns })

const auth = firebase.auth();
const db = firebaseApp.firestore()

export { db, auth }
