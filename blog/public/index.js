Vue.use(VueRouter);

const auth = firebase.auth();
const db = firebase.firestore();

new Vue({
  el: "#app",
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
});
