// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
const firebase = require("firebase/app")
const firestore = require("firebase/firestore")
const initializeApp = firebase.initializeApp
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2Y0VhPFf9m8yyhC0ujiiaENZNMgM1VME",
  authDomain: "chat-in-max.firebaseapp.com",
  projectId: "chat-in-max",
  storageBucket: "chat-in-max.appspot.com",
  messagingSenderId: "360082435840",
  appId: "1:360082435840:web:cfc04da652876df7dc8de5",
  measurementId: "G-FTPL7EZLFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = firestore.getFirestore(app);

const maxAPI = require("max-api");

maxAPI.addHandler("send", async msg => {
  maxAPI.post("sending " + msg);
  try {
    const docRef = await firestore.addDoc(firestore.collection(db, "messages"), {
      m: msg,
      date: new Date()
    });
    maxAPI.post("Document written with ID: ", docRef.id);
  } catch (e) {
    maxAPI.post("Error adding document: ", e);
  }
});

maxAPI.addHandler("wipe", async _ => {
  maxAPI.post("deleting fields");
  const querySnapshot = await firestore.getDocs(firestore.collection(db, "messages"));
    querySnapshot.forEach( async doc => {
      await firestore.deleteDoc(firestore.doc(db, "messages", doc.id));
  });
});

const q = firestore.query(firestore.collection(db, "messages"), firestore.orderBy("date"));
const _ = firestore.onSnapshot(q, querySnapshot => {
  const messages = [];
  querySnapshot.forEach((doc) => {
      messages.push(doc.data().m);
  });
  maxAPI.outlet("messages: ", messages.join(", "));
});


