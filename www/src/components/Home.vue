<script lang="ts">
//import { console } from "tracer";
//const log = console.colorConsole();
console.debug("test");
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watchEffect,
  onMounted,
} from "vue";

import firebase from "../firebase/firebaseInit";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(firebase);

export default defineComponent({
  setup() {
    const comments = ref([]);
    onMounted(async () => {
      const res = await getDocs(collection(db, "comments"));
      res.forEach((docs: QueryDocumentSnapshot) => {
        comments.value = docs.data();
      });
      console.log(comments);
    });
    return {
      comments,
    };
  },
});
</script>

<template>
  <div id="home">
    <ul class="collection with-header">
      <li>{{ comments }}</li>
    </ul>
  </div>
</template>
