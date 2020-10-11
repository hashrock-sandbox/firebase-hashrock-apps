<template>
  <div>
    <div>
    {{user.displayName}}
    <button v-if="!user" @click="login">login</button>
    <button v-if="user" @click="logout">logout</button>
    </div>
    <div v-for="(item, idx) in items" :key="idx" @click="selectItem(item)" class="item" :class="{'selected': selectedId === item.id}">
      {{item.name}} <button @click="removeItem(item)">x</button>
    </div>
    <button @click="addPost">Add</button>
    <textarea :disabled="!selectedItem" v-model="contents" @input="debouncedSave"></textarea>
  </div>
</template>
<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig } from "../share/config";
import debounce from 'lodash.debounce';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let db = firebase.firestore();

export default {
  data() {
    return {
      msg: "Hello",
      user: {},
      items: [],
      contents: "",
      selectedId: "",
      original: "",
    };
  },
  computed: {
    selectedDoc(){
      return db.doc(`users/${this.user.uid}`)
        .collection("posts")
        .doc(this.selectedId)
    },
    selectedItem(){
      return this.items.find((i)=>i.id === this.selectedId)
    },
    dirty(){
      return this.original !== this.contents
    }
  },
  methods: {
    getDocById(id){
      return db.doc(`users/${this.user.uid}`)
        .collection("posts")
        .doc(id)
    },
    login() {
      auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    },
    logout() {
      auth.signOut();
    },
    selectItem(item){
      if(this.dirty){
        this.selectedDoc.update(
          {
            contents: this.contents,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          }
        ).then(()=>{
          this.selectedId = item.id;
          this.contents = item.contents;
          this.original = this.contents;
        })
      }else{
        this.selectedId = item.id;
        this.contents = item.contents;
        this.original = this.contents;
      }
    },
    save(){
      this.selectedDoc.update(
        {
          contents: this.contents,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
      )
      this.selectedItem.contents = this.contents;
      this.original = this.contents;
    },
    addPost() {
      const post = {
          name: "Sample",
          contents: this.contents,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }
      this.contents = "";
      this.original = this.contents;

      db.doc(`users/${this.user.uid}`)
        .collection("posts")
        .add(post)
        .then((docRef)=> {
          this.selectedId = docRef.id
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error)=> {
          console.error("Error adding document: ", error);
        });
    },
    removeItem(item){
      console.log(item)
      console.log(this.getDocById(item.id))
      this.getDocById(item.id).delete()
      this.items.splice(this.items.indexOf(item), 1);
      this.contents = ""
      this.original = this.contents;
      this.selectedId = ""
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      this.user = user;
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
              console.log("modi")
              // commit('set', payload)
            } else if (change.type === "removed") {
              // commit('remove', payload)
              console.log("rm")
            }
          });
        });
    });
  },
  created: function () {
    this.debouncedSave = debounce(this.save, 500)
  },  
};
</script>
<style>
.item.selected{
  background: yellow;
}

</style>