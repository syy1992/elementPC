import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  baseURL: process.env.BASE_URL, // api 的 base_url
  timeout: 50000 // 请求超时时间
})
console.log('env=' + process.env.BASE_API)
// request拦截器
service.interceptors.request.use(
  config => {
    config.withCredentials = true
    if (store.getters.token) {
      config.headers['X-Token'] = localStorage.token // 让每个请求携带自定义token 请根据实际情况自行修改
      // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * resCode为非0000是抛错 可结合自己业务进行修改
     */
    const res = response.data

    if (res.resCode === '9999') {
      Message({
        message: res.resMsg,
        type: 'error'
      })
    }
    if (res.resCode === '9990') {
      Message({
        message: res.resMsg,
        type: 'error'
      })
      // store.commit('login', false)
      store.commit('clearStorage')
    }
    return response
  },
  error => {
    console.log('err' + error) // for debug
    // if (service.timeout > 50000) {   // 判断请求异常信息中是否含有超时timeout字符串
    //   alert('网络超时')
    //   return Promise.reject(error)       // reject这个错误信息
    // }
    Message({
      message: error.message, //error.message
      type: 'error',
      duration: 1500
    })
    return Promise.reject(error)
  },
)

export default service
