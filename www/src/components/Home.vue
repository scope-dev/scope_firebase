<template>
  <div id="home">
    <ul class="collection with-header">
      <li>テスト</li>
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

import { projectFirestore } from "../firebase/firebaseInit";
export default defineComponent({
  setup() {
    console.log("MODE: " + import.meta.env.MODE);

    const load = async () => {
      try {
        projectFirestore
          .collection("comments")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(`${doc.id} => ${doc.data()}`);
              //this.data.push(doc.data().name)
            });
          });

        // const commentQuery = await getDocs(commentsDB);
        // const comments = commentQuery.docs.map((doc) => doc.data());
        // console.log(comments);
        //makers = cityList;
      } catch (err) {
        console.log(err);
      }
    };
    load();
  },
});
</script>
