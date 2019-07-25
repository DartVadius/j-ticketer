import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

export const Api = {
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.headers.common['Content-Type'] = 'application/json'
    Vue.axios.defaults.headers.common['Cache-Control'] = 'no-cache'
    Vue.axios.defaults.headers.common['Accept'] = 'application/json'
  },
  setAuth (data) {
    let buf = Buffer.from(data['token'])
    Vue.axios.defaults.baseURL = data['baseUrl']
    Vue.axios.defaults.headers.common['Authorization'] = 'Basic ' + buf.toString('base64')
    return true
  },
  query (resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`ApiService ${error}`)
    })
  },
  get (resource) {
    return Vue.axios.get(resource).catch(error => {
      throw new Error(`ApiService ${error}`)
    })
  },
  post (resource, params) {
    console.log(Vue.axios.defaults.headers)
    return Vue.axios.post(resource, params).catch(error => {
      throw new Error(`ApiService ${error}`)
    })
  },
  put (resource, params) {
    return Vue.axios.put(resource, params).catch(error => {
      throw new Error(`ApiService ${error}`)
    })
  },
  delete (resource) {
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(`ApiService ${error}`)
    })
  }
}
