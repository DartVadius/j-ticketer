import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VeeValidate from 'vee-validate'
import './registerServiceWorker'
import './quasar'
import { Api } from './api/queries'
import Store from 'electron-store'
import i18n from './i18n'

Vue.config.productionTip = false

const schema = {
  url: {
    type: 'string',
    format: 'url'
  }
}

Api.init()

const dataStore = new Store({
  schema,
  name: 'j-ticketer-data',
  cwd: 'user-data'
})

let config = {
  login: dataStore.get('login'),
  password: dataStore.get('password'),
  url: dataStore.get('url'),
  locale: dataStore.get('locale')
}

if (config.locale) i18n.locale = config.locale

Api.setAuth({ token: [config.login, config.password].join(':'), baseUrl: config.url })

const appSchema = {}

const appStore = new Store({
  appSchema,
  name: 'app-data',
  cwd: 'user-data'
})

Vue.prototype.$jsonStore = appStore

Vue.prototype.$eventBus = new Vue()

Vue.use(VeeValidate)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
