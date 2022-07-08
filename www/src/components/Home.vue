<script setup>
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
import nextengine from '@/plugins/nextengine'

const store = useStore();
const comments = ref([]);
let orders = ref();
let product_id = ref();

const setProductId = (data) => {
  product_id.value = data.target.value
}

const getOrders = () => {
  console.log(product_id.value)
  const ne = new nextengine(localStorage.getItem('at'),localStorage.getItem('rt'))
  ne
  .query('/api_v1_master_stockiohistory/search')
  .where('goods_id', 'like', 'iia86a11111')
  //.where('receive_order_row_cancel_flag', '=', '0')
  //.offset(2)
  //.limit(100)
  .get(['stock_io_history_goods_id', 'stock_io_history_quantity', 'stock_goods_id'])
  //.count()
  .then((res) => {
    //console.log(res);
    orders.value = res;
  });
};
</script>

<template>
  <div id="home">
      <router-link to="/test">Go to Test</router-link><br />
        <input type="text" :value="product_id" @input="setProductId"/>
        <button @click="getOrders">取得</button>
      <div v-if="!!orders">
            
        <div v-if="orders.data.result == 'success'">
          
          <h4>count: {{ orders.data.count }}</h4>
          <h4>{{ orders.data.message }}</h4>
          <ul>
            <li v-for="(order , i) in orders.data.data" :key="i">{{order.receive_order_row_receive_order_id}}/  数量：{{order.receive_order_row_quantity}} / 受注日：{{order.receive_order_row_stock_allocation_date}}</li>
          </ul>
        </div>
        <div v-if="orders.data.result == 'error'">
          
          <h4>{{ orders.data.message }}</h4>
        </div>
        
      </div>
  </div>
</template>
