import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // getToken from cookie

router.beforeEach((to, from, next) => {
  // console.log('to.fullPath='+ to.fullPath)
  // console.log('to.path='+ to.path)
  // console.log('from.fullPath='+ from.fullPath)
  // console.log('from.path='+ from.path)
  NProgress.start()
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (JSON.parse(localStorage.getItem('islogin'))) { //判断本地是否存在access_token
      next()
    } else {
      NProgress.done()
      // alert('2')
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

