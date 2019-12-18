import Vue from "vue";
import App from "./App";
import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App)
});