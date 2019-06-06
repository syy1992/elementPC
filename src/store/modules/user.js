import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userData: null,
    islogin: '',
    userType: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      console.log('state.token='+state.token)
      localStorage.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
      localStorage.username = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
      localStorage.avatarImgPath = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERTYPE: (state, userType) => {
      state.userType = userType
    },
    SET_USERDATA: (state, userData) => {
      state.userData = userData
      localStorage.userData = JSON.stringify(userData)
    },
    clearStorage: (state) => {
      localStorage.clear()
    },
    login: (state, n) => {
      let islogin = JSON.parse(n)   //传入登录状态islogin
      localStorage.setItem('islogin', JSON.stringify(islogin))
      console.log(islogin)
      state.islogin = islogin
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          if (response.data.resCode === '0000') {
            // sessionStorage.setItem('menuData', JSON.stringify(response.data.permissions))
            localStorage.setItem('menuData', JSON.stringify(response.data.permissions))
            setToken(response.data.data.token)
            commit('SET_TOKEN', response.data.data.token)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.token).then(response => {
    //       const data = response.data
    //       if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //         commit('SET_ROLES', data.roles)
    //       } else {
    //         reject('getInfo: roles must be a non-null array !')
    //       }
    //       commit('SET_NAME', data.name)
    //       // commit('SET_AVATAR', data.avatar)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 获取用户信息 重写
    GetInfo({ commit, state }) {
      console.log('GetInfo.token=' + state.token)
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.data.userType) { // 验证返回的roles是否是一个非空数组
            commit('SET_USERTYPE', data.data.userType)
            // resolve()
          } else {
            reject('userType获取失败')
          }
          alert('ok')
          // commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then((response) => {
          commit('SET_TOKEN', '')
          // commit('SET_ROLES', [])
          // removeToken()
          localStorage.removeItem('token')
          commit('login', false) //fixme
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
