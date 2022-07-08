import { httpsCallable } from "firebase/functions";
import firebaseFunctions from './init';

const neGetKey = httpsCallable(firebaseFunctions, 'neGetKey');

export default {
    async callNeGetKey() {
        let res = await neGetKey()
        console.log(res)
        return res.data
    }
}