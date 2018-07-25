import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import Routers from '../../router/main'
import App from './app.vue'
import axios from 'axios'
import {util, vueReceiveParentToMessages, frameApi} from '../../../../../index'


Vue.use(VueRouter);
Vue.use(iView);

axios.defaults.baseURL = process.env.API_BASE;
axios.defaults.timeout = 1000 * 60;

// 路由配置
const router = new VueRouter({
  mode: 'history',
  base: process.env.PUBLIC_PATH,
  routes: Routers
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  //设置title
  window.document.title = to.meta.title || '';
  frameApi.sendMessagesToParent({
    type: 'documentTitle',
    data: to.meta.title
  });

  let uid = util.lockr('uid'), isGo = true;
  if (to.meta.identity && !uid) {
    isGo = false;
    next(isGo);
    frameApi.href('/login');
  }
  if (isGo) {
    frameApi.history(process.env.PUBLIC_PATH + to.fullPath);
    next()
  }
});

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0)
});


vueReceiveParentToMessages(() => {
  window.bus = new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  });

  window.bus.$Message.config({
    top: 60,
    duration: 3
  });
});




