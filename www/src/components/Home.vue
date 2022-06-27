<script lang="ts">
//import { console } from "tracer"
//const log = console.colorConsole()
import { useStore } from "vuex";
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  isReactive,
  computed,
  watchEffect,
  onMounted,
} from "vue";

// import firebaseDb from "../firebase/firestore/init";
// import {
//   addDoc,
//   collection,
//   serverTimestamp,
//   getDocs,
// } from "firebase/firestore";

export default defineComponent({
  setup() {
    const store = useStore();
    const comments = ref([]);
    onMounted(async () => {
      // const res = await getDocs(collection(firebaseDb, "comments"));
      // res.forEach((docs: QueryDocumentSnapshot) => {
      //   //comments.value = docs.data()
      //   comments.value.push(docs.data());
      // });
      //console.log(comments)
    });
    return {
      comments,
      // computed 関数のステートにアクセスします
      count: computed(() => store.state.count),
      increment: () => store.commit("increment"),
      keyExpired: computed(() => store.state.keyExpired),
    };
  },
});
</script>

<template>
  <div id="home">
    <router-link to="/test">Go to Test</router-link>

    <span class="count">
      {{ keyExpired }}
    </span>
    <button @click="increment">ボタン</button>

    <ul class="collection with-header">
      <li>{{ comments }}</li>
    </ul>
  </div>
</template>
