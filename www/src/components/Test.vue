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

const isEmulating = window.location.hostname === "localhost";

const store = useStore();
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
    'fields':"stock_io_history_before_stock_quantity,stock_io_history_after_stock_quantity,stock_io_history_date,stock_io_history_quantity,stock_io_history_io_flag,stock_io_history_reason",
    'stock_io_history_goods_id-like':product_id.value, //"iia86a11111"
  };
  let queryStr = qs.stringify(par);
  console.log(queryStr)
  
  let baseURL = 'https://api.next-engine.org/'
  if (isEmulating) {
    baseURL =  '/ne_api/'
  }
  axios
    .post( baseURL +"api_v1_master_stockiohistory/search", queryStr)
    .then((res) => {
      console.log(res);
      orders.value = res;
    });
};
</script>

<template>
  <div id="home">
    <router-link to="/">Go to home</router-link><br />
      <input type="text" :value="product_id" @input="setProductId"/>
      <button @click="getOrders">取得</button>

  <ul v-if="orders" class="collection with-header">
      <li v-for="(order , i) in orders.data.data" :key="i">変更前：{{order.stock_io_history_before_stock_quantity}}/  変更後：{{order.stock_io_history_after_stock_quantity}} / 入庫数: {{order.stock_io_history_quantity }} / フラグ:{{orders.stock_io_history_io_flag}} / 発生日：{{order.stock_io_history_date}} / 事由:{{order.stock_io_history_reason}}</li>
    </ul>
  </div>
</template>
