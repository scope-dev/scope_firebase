<script lang="ts">
import { useStore } from "vuex";
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
    const store = useStore();
    const comments = ref([]);
    onMounted(async () => {
      return true;
    });
    return {
      keyExpired: computed(() => store.state.keyExpired),
    };
  },
});
</script>

<template>
  <div id="home">
    <router-link to="/">Go to Top</router-link>

    <span class="count">
      {{ keyExpired }}
    </span>
  </div>
</template>
