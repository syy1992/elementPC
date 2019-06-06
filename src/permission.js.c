import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

// router.beforeEach((to, from, next) => {
//   // NProgress.start()
//   if (store.getters.token !== '') {
//     console.log(JSON.stringify(to.matched))
//   } else {
//     next(router.replace({
//       path: '/login'
//       // query: {redirect: router.currentRoute.fullPath}
//     }))
//   }
//
// })


// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
//     if (getToken()) {  // 通过vuex state获取当前的token是否存在
//       next('/dashboard')
//     }
//     else {
//       next({
//         path: '/login',
//         query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       })
//     }
//   }
//   else {
//     next()
//   }
// })
// const whiteList = ['/login'] // 不重定向白名单
// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   if (getToken()) {
//     if (to.path === '/login') {
//       next({ path: '/' })
//       NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
//     } else {
//       if (store.getters.roles.length === 0) {
//         store.dispatch('GetInfo').then(res => { // 拉取用户信息
//           next()
//         }).catch((err) => {
//           store.dispatch('FedLogOut').then(() => {
//             Message.error(err || 'Verification failed, please login again')
//             next({ path: '/' })
//           })
//         })
//       } else {
//         next()
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
//       // next(`/login`) // 否则全部重定向到登录页
//       NProgress.done()
//     }
//   }
// })
//
// router.afterEach(() => {
//   NProgress.done() // 结束Progress
// })

// router.beforeEach((to, from, next) => {
//   console.log(to.fullPath)
//   // NProgress.start()
//   //
//   // if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//   //   if (JSON.parse(localStorage.getItem('islogin'))) { //判断本地是否存在access_token
//   //     // NProgress.done()
//   //     next()
//   //   } else {
//   //     next({
//   //       path: '/login'
//   //     })
//   //   }
//   // }else {
//   //   next()
//   // }
//   // /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
//   // if (to.fullPath == "/login") {
//   //   if (JSON.parse(localStorage.getItem('islogin'))) {
//   //     next({
//   //       path: from.fullPath
//   //     })
//   //   } else {
//   //     next()
//   //   }
//   // }
//   //
//   // if (to.meta.requireAuth) {
//   //   if (!JSON.parse(localStorage.getItem('islogin'))) {
//   //     if (to.path === '/login') {
//   //       console.log(1)
//   //       // next({ path: '/' })
//   //       next()
//   //     } else {
//   //       console.log(2)
//   //       if (store.getters.userType == '') {
//   //         console.log(3)
//   //         store.dispatch('GetInfo').then(res => { // 拉取用户信息
//   //           next()
//   //         }).catch((err) => {
//   //           store.dispatch('FedLogOut').then(() => {
//   //             Message.error(err || 'Verification failed, please login again')
//   //             next({ path: '/' })
//   //           })
//   //         })
//   //       } else {
//   //         next()
//   //       }
//   //     }
//   //   }
//   // }
//
//
//
//   if (to.fullPath == "/login") {
//     if (JSON.parse(localStorage.getItem('islogin'))) {
//       next({
//         // path: from.fullPath
//         path: from.fullPath
//       })
//     } else {
//       next()
//     }
//   }
//
// })

// NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  console.log('to.fullPath='+ to.fullPath)
  console.log('to.path='+ to.path)
  console.log('from.fullPath='+ from.fullPath)
  console.log('from.path='+ from.path)
  NProgress.start()
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (JSON.parse(localStorage.getItem('islogin'))) { //判断本地是否存在access_token
      // NProgress.done()
      next()
    } else {
      NProgress.done()
      next({
        path: '/login'
      })
    }
  }else {
    next()
  }
  /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
  if (to.fullPath == "/login") {
    if (JSON.parse(localStorage.getItem('islogin'))) {
      next({
        path: from.fullPath
      })
    } else {
      next()
    }
  }
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
