<template>
  <div>
    <p>init</p>
  </div>
</template>
<script>
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBC5M71h7Kg2MMprdTYBtTbwxja4GpmjUQ",
  authDomain: "hashrock-apps.firebaseapp.com",
  databaseURL: "https://hashrock-apps.firebaseio.com",
  projectId: "hashrock-apps",
  storageBucket: "hashrock-apps.appspot.com",
  messagingSenderId: "1090809034156",
  appId: "1:1090809034156:web:b68138c6793d1e4a687609"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default {
  data() {
    return {
      msg: "Hello",
      user: {},
      items: []
    };
  },
  methods: {
    login() {
      auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    },
    logout() {
      auth.signOut();
    },
    addPost() {
      var db = firebase.firestore();
      db.doc(`users/${this.user.uid}`)
        .collection("posts")
        .add({
          first: "Ada",
          last: "Lovelace",
          born: 1815
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    },
    fetchPost() {
      //   db.collection("users")
      //   .orderBy("timestamp", "desc")
      //   .limit(100)
      //   .onSnapshot(snapshot => {
      //     snapshot.docChanges().forEach(change => {
      //       if (change.type === "added") {
      //         this.items.push({
      //           ...change.doc.data({ serverTimestamps: "estimate" }),
      //           id: change.doc.id
      //         });
      //       } else if (change.type === "modified") {
      //         // commit('set', payload)
      //       } else if (change.type === "removed") {
      //         // commit('remove', payload)
      //       }
      //     });
      //   });
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

};
</script>