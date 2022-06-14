import { ref } from '@vue/reactivity'
import firebaseinit from "../firebase/firebaseInit";
import { projectAuth } from '../firebase/firebaseInit'

const error = ref(null)

const signup = async (email, password, displayName) => {
  error.value = null //エラーをずっと表示しないようにする

  try {
    const res = await projectAuth.createUserWithEmailAndPassword(
      email,
      password
    )
    if (!res) {
      throw new Error('Could not complete the signup')
    }
    await res.user.updateProfile({ displayName }) //updateProfile()はdisplayNameに入力した名前を表示するために必要
    error.value = null //エラーが起きたあとまたサインインしようとするときにエラーを表示させないため
    console.log(res.user)
    return res
  } catch (err) {
    console.log(err.message)
    error.value = err.message //errorを更新する
  }
}

const useSignup = () => {
  return { error, signup }
}

export default useSignup