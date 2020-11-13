import Vue from "vue";
import App from "./App.vue";
import VueRouter from 'vue-router'
import Preview from './Preview.vue'
import Editor from './Editor.vue'

// Vue.use(VueRouter)
Vue.config.productionTip = false;
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/preview/:uid/:docid',
      component: Preview
    },
    {
      path: '/',
      component: Editor
    },
  ]
})


/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router
});