<template>
  <div>
    <h1>Preview</h1>
    <textarea v-model="contents" name id cols="50" rows="50"></textarea>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig } from "../share/config";
import debounce from "lodash.debounce";
import Anydown from "@anydown/anydown-core";
import "@anydown/anydown-core/dist/anydown-core.es.css";
import { compile, getYMD } from "./util";

// Initialize Firebase

export default {
  data() {
    return {
      contents: ""
    };
  },
  mounted() {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    let db = firebase.firestore();

    var docRef = db.doc(`public/${this.$route.params.uid}`).collection("posts").doc(this.$route.params.docid);

    docRef
      .get()
      .then((doc)=> {
        if (doc.exists) {
          console.log("Document data:", );
          this.contents = doc.data().contents
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }
};
</script>

<style>
</style>