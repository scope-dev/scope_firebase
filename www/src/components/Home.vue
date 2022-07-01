<script setup lang="ts">
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
  withDefaults,
} from "vue";

import axios from "axios";
import qs from "qs";

const store = useStore();
const comments = ref([]);
let orders = ref();
let product_id = ref();

const setProductId = (data) => {
  product_id.value = data.target.value
}

const getOrders = () => {
  console.log(product_id.value)
  let par = {
    'access_token':localStorage.getItem('at'),
    'refresh_token':localStorage.getItem('rt'),
    'fields':"receive_order_row_receive_order_id,goods_id,receive_order_row_goods_name,receive_order_row_quantity,receive_order_row_unit_price,receive_order_row_cancel_flag,receive_order_row_stock_allocation_date",
    'goods_id-like':product_id.value, //"iia86a11111"
    'receive_order_row_cancel_flag-eq':'0' //キャンセルではない
  };
  let queryStr = qs.stringify(par);
  axios
    .post("/ne_api/api_v1_receiveorder_row/search", queryStr)
    .then((res) => {
      console.log(res);
      orders.value = res;
    });
};
</script>

<template>
  <div id="home">
    <router-link to="/test">Go to Test</router-link><br />
      <input type="text" :value="product_id" @input="setProductId"/>
      <button @click="getOrders">取得</button>

  <ul v-if="orders" class="collection with-header">
      <li v-for="(order , i) in orders.data.data" :key="i">{{order.receive_order_row_receive_order_id}}/  数量：{{order.receive_order_row_quantity}} / 受注日：{{order.receive_order_row_stock_allocation_date}}</li>
    </ul>
  </div>
</template>
