<template>
  <div id="home">
    <ul class="collection with-header">
      <li>テストです</li>
    </ul>
  </div>
</template>

<script lang="ts">
//import { console } from "tracer";
//const log = console.colorConsole();
console.debug("test");
import {
  computed,
  defineComponent,
  ref,
  reactive,
  watchEffect,
  onMounted,
} from "vue";

import firebaseinit from "../firebase/firebaseInit";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
const db = getFirestore(firebaseinit);
export default defineComponent({
  setup() {
    console.log(import.meta.env.MODE);
    // data
    let makers = reactive<{ id: number; name: string }[]>([
      {
        id: 1,
        name: "aio",
      },
      {
        id: 2,
        name: "gtr",
      },
    ]);
    console.log(makers);
    const commentsDB = collection(db, "comments");
    const load = async () => {
      try {
        const commentQuery = await getDocs(commentsDB);
        const comments = commentQuery.docs.map((doc) => doc.data());
        console.log(comments);
        //makers = cityList;
      } catch (err) {
        console.log(err);
      }
    };
    load();
  },
});
</script>
