<template>
  <div class="wrapper">
    <div class="itemList">
      <div style="display: flex; justify-content: center; align-items: center; padding: 0.25em;">
        <img width="64" src="./icon-dark.svg" />
      </div>
      <div class="login" style="font-size: 0.8em; background: #666; display: flex;">
        <div
          class="login__name"
          style="flex: 1; margin: 0 0.5em;"
          v-if="user"
        >{{user.displayName}}さん</div>
        <button v-if="!user" @click="login">Login</button>
        <button v-if="user" @click="logout">Logout</button>
      </div>
      <div v-if="user">
        <div
          v-for="(item) in items"
          :key="item.id"
          @click="selectItem(item)"
          class="item"
          :class="{'selected': selectedId === item.id, 'disabled': dirty}"
        >
          <div class="item__label">{{item.name}}</div>
          <button class="item__remove" @click="removeItem(item)">x</button>
        </div>
        <button @click="addPost" class="addPost">New Document</button>
      </div>
    </div>
    <div class="form">
      <input type="text" v-model="name" @input="debouncedSave" class="name" />
      <textarea :disabled="!selectedItem" v-model="contents" @input="debouncedSave" class="source"></textarea>
    </div>

    <div class="output">
      <anydown :blocks="splited" @change="updateBlock($event)"></anydown>
    </div>
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let db = firebase.firestore();

export default {
  components: {
    Anydown
  },
  data() {
    return {
      user: {},
      items: [],
      contents: "",
      name: "",
      selectedId: "",
      original: "",
      splited: []
    };
  },
  watch: {
    contents(val) {
      this.splited = compile(val);
    }
  },
  computed: {
    selectedDoc() {
      return db
        .doc(`users/${this.user.uid}`)
        .collection("posts")
        .doc(this.selectedId);
    },
    selectedItem() {
      return this.items.find(i => i.id === this.selectedId);
    },
    dirty() {
      return this.original !== this.contents;
    }
  },
  methods: {
    updateBlock(payload) {
      this.splited[payload.id].text = payload.type + "\n" + payload.body;
      this.contents = this.splited.map(i => i.text).join("```");
    },
    getDocById(id) {
      return db
        .doc(`users/${this.user.uid}`)
        .collection("posts")
        .doc(id);
    },
    login() {
      auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    },
    logout() {
      auth.signOut();
    },
    selectItem(item) {
      if (this.dirty) {
        return;
      }
      this.selectedId = item.id;
      this.contents = item.contents;
      this.original = this.contents;
      this.name = item.name;
    },
    save() {
      this.selectedDoc.update({
        contents: this.contents,
        name: this.name,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      this.original = this.contents;
    },
    addPost() {
      const post = {
        name: `Memo ${getYMD()}`,
        contents: this.contents,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      this.clear();

      db.doc(`users/${this.user.uid}`)
        .collection("posts")
        .add(post)
        .then(docRef => {
          this.selectedId = docRef.id;
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    },
    removeItem(item) {
      this.getDocById(item.id).delete();
      this.clear();
    },
    clear() {
      this.contents = "";
      this.original = this.contents;
      this.selectedId = "";
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      this.user = user;
      db.doc(`users/${user.uid}`)
        .collection("posts")
        .limit(100)
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              this.items.push({
                ...change.doc.data({ serverTimestamps: "estimate" }),
                id: change.doc.id
              });
            } else if (change.type === "modified") {
              const found = this.items.find(i => {
                return i.id === change.doc.id;
              });

              if (found) {
                Object.assign(
                  found,
                  change.doc.data({ serverTimestamps: "estimate" })
                );
                // 入力中にupdateされるとUXが悪いので無効化
                // if (this.selectedItem === found) {
                //   this.contents = found.contents;
                // }
              }
              // console.log("mod");
            } else if (change.type === "removed") {
              this.items.splice(
                this.items.findIndex(i => {
                  return i.id === change.doc.id;
                }),
                1
              );
              console.log("rm");
            }
          });
        });
    });
  },
  created: function() {
    this.debouncedSave = debounce(this.save, 1000);
  }
};
</script>
<style>
body,
html {
  height: 100%;
  margin: 0;
}
.wrapper {
  display: flex;
  height: 100%;
}
.itemList {
  width: 200px;
  background: #333;
  color: white;
}
.form {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.item {
  background: #333;
  cursor: pointer;
  color: #ddd;
  font-family: system-ui;
  font-size: 0.9em;
  display: flex;
}
.item:hover {
  background: #666;
}
.item.selected {
  background: #99a;
  color: white;
}
.item.disabled {
  color: #aaa;
}
.item__label {
  padding: 0.25em 0.5em;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
}

.item__remove {
  background: none;
  color: white;
  border: none;
  opacity: 0;
}
.item:hover .item__remove {
  opacity: 1;
}
.item__remove:hover {
  color: #ccf;
}

.name {
  font-size: 1.5em;
  background: #333;
  border: 1px solid black;
  color: white;
  outline: none;
}
.name:focus {
  background: #444;
}
.source {
  flex: 1;
  width: 100%;
  background: #333;
  color: white;
  padding: 0.5rem;
  border: 1px solid black;
  outline: none;
}
.source:focus {
  background: #444;
}
.addPost {
  width: 100%;
  line-height: 1.5rem;
  background: #333;
  color: white;
  border: 1px solid white;
  margin-top: 4px;
  outline: none;
}
.addPost:hover {
  background: #666;
}
.addPost:focus {
  border: 1px solid orange;
}
.addPost:active {
  border: 1px solid white;
}
.output {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-all;
  padding: 0.5rem;
}
</style>