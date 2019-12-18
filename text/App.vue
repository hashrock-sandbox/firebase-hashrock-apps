<template>
  <div>
    <p>init</p>
    <p>{{user.displayName}}</p>
    <button @click="login">login</button>
    <div v-for="(item, idx) in items" :key="idx">
      {{item}}
    </div>
  </div>
</template>
<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {firebaseConfig} from "../share/config"

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
      var db = firebase.firestore();

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
      console.log(user)
      db.doc(`users/${user.uid}`)      
      .collection("posts")
      // .orderBy("timestamp", "desc")
      .limit(100)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            this.items.push({
              ...change.doc.data({ serverTimestamps: "estimate" }),
              id: change.doc.id
            });
          } else if (change.type === "modified") {
            // commit('set', payload)
          } else if (change.type === "removed") {
            // commit('remove', payload)
          }
        });
      });

    });
  }

};
</script>