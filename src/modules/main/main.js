import Vue from 'vue'
import App from './Main.vue'
import router from '../../router'
import store from '../../store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../../less/index.css'

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
