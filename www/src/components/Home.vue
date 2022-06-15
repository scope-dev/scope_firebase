<script lang="ts">
//import { console } from "tracer";
//const log = console.colorConsole();
console.debug("test");
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
  watchEffect,
  onMounted,
} from "vue";

import firebaseDb from "../firebase/firestore/init";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

export default defineComponent({
  setup() {
    const comments = ref([]);
    onMounted(async () => {
      const res = await getDocs(collection(firebaseDb, "comments"));
      res.forEach((docs: QueryDocumentSnapshot) => {
        //comments.value = docs.data();
        comments.value.push(toRefs(docs.data()));
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
