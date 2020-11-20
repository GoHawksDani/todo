import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyA5XT8kXxvt2oq6l59tvefY5kpnqgCKUrE",
    authDomain: "todo-app-f9dba.firebaseapp.com",
    databaseURL: "https://todo-app-f9dba.firebaseio.com",
    projectId: "todo-app-f9dba",
    storageBucket: "todo-app-f9dba.appspot.com",
    messagingSenderId: "60057717887",
    appId: "1:60057717887:web:83f33b2ff0c49e4d57834a"
};
try {
    firebase.initializeApp(firebaseConfig);
} catch(err){
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)}
}
const fire = firebase;
export default fire;