<template>
  <form @submit.prevent="handleSubmit">
    <input
      type="text"
      required
      placeholder="display name"
      v-model="displayName"
    />
    <input type="email" required placeholder="email" v-model="email" />
    <input type="password" required placeholder="password" v-model="password" />
    <div class="error">{{ error }}</div>
    <button>Sign up</button>
  </form>
</template>

<script>
import { ref } from "vue";
import useSignup from "../function/useSignup";

export default {
  setup(props, context) {
    //Welcome.vueにわたすemitを使えるようにするためcontextを引数に設定する
    const { error, signup } = useSignup();

    // refs
    const displayName = ref("");
    const email = ref("");
    const password = ref("");

    const handleSubmit = async () => {
      // console.log(displayName.value, email.value, password.value)
      await signup(email.value, password.value, displayName.value);
      if (!error.value) {
        // console.log('user signed up')
        context.emit("signup"); //Welcome.vueにわたす
      }
    };

    return { displayName, email, password, handleSubmit, error };
  },
};
</script>
