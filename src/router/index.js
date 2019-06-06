import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// 在开发环境中，不要使用延迟加载，因为延迟加载太多页面会导致Webpack热更新太慢。所以只在生产中使用惰载；
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  // {
  //   path: '/productWarrant',
  //   // name: 'productWarrant',
  //   component: () => import('@/views/productManage/productWarrant'),
  //   meta: { title: '产品授权' }
  // },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   name: 'Dashboard',
  //   hidden: true,
  //   children: [{
  //     path: 'dashboard',
  //     component: () => import('@/views/dashboard/index')
  //   }]
  // },

  {
    path: '',
    component: Layout,
    // redirect: '/dashboard',
    redirect: '/login',

    // meta: { title: '例子2', icon: 'example' },
    children: [{
      path: '/dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'home', noCache: true, requireAuth: true, roles: [1, 2, 3] }
    }]
  },

  {
    path: '/example',
    component: Layout,
    // redirect: '/example/table',
    alwaysShow: true,
    name: 'Example',
    meta: { title: '场景管理', icon: 'icon' },
    children: [
      {
        path: 'channelList',
        name: 'channelList',
        component: () => import('@/views/scene/channelList'),
        // meta: { title: '渠道列表', icon: 'dingdanguanli' }
        meta: { title: '渠道列表', requireAuth: true, roles: [1] }
      },
      {
        path: '/salesList',
        name: 'salesList',
        component: () => import('@/views/scene/salesList'),
        meta: { title: '业务员列表', requireAuth: true, roles: [3] },
        hidden: true
        // JSON.parse(localStorage.userData).salesmanNo == null
      }
      // {
      //   path: 'tree',
      //   name: 'Tree',
      //   component: () => import('@/views/tree/index'),
      //   meta: { title: '产品授权' }
      // }
    ]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'menu' }
  //     }
  //   ]
  // },
  {
    path: '/productManage',
    component: Layout,
    meta: { title: '产品管理', icon: 'menu' },
    alwaysShow: true,
    name: 'productManage',
    children: [
      {
        path: '/productManage/productList',
        name: 'productList',
        component: () => import('@/views/productManage/productList'),
        meta: { title: '产品列表', requireAuth: true, roles: [1, 2, 3] }
      },
      {
        path: '/productManage/productWarrant',
        name: 'productWarrant',
        component: () => import('@/views/productManage/productWarrant'),
        meta: { title: '产品授权', requireAuth: true, roles: [1, 2, 3] },
        hidden: true
      }
    ]
  },
  {
    path: '/policyManage',
    component: Layout,
    meta: { title: '保单管理', icon: 'dingdanguanli' },
    // redirect: '/policyList',
    alwaysShow: true,
    name: 'policyManage',
    children: [
      {
        path: '/policyList',
        name: 'policyList',
        component: () => import('@/views/policyManage/policyList'),
        meta: { title: '保单列表', requireAuth: true, roles: [1, 2, 3] }
      }
    ]
  },
  {
    path: '/statistical',
    component: Layout,
    alwaysShow: true,
    name: 'statistical',
    // redirect: '/achievement',
    meta: { title: '统计分析', icon: 'tongjifenxi' },
    children: [
      // {
      //   path: '/achievement',
      //   name: 'achievement',
      //   component: () => import('@/views/statistical/achievement'),
      //   meta: { title: '数据分析', requireAuth: true }
      // },
      {
        path: '/ProductAchievement',
        name: 'ProductAchievement',
        component: () => import('@/views/statistical/ProductAchievement'),
        meta: { title: '产品销量统计', requireAuth: true, roles: [1, 2, 3] }
      },
      {
        path: '/channelAchievement',
        name: 'channelAchievement',
        component: () => import('@/views/statistical/channelAchievement'),
        meta: { title: '渠道销量统计', requireAuth: true, roles: [1] }
      },
      {
        path: '/statistical/productReportDetail',
        name: 'productReportDetail',
        component: () => import('@/views/statistical/productReportDetail'),
        meta: { title: '产品销售详情', requireAuth: true },
        hidden: true
      },
      {
        path: '/statistical/channelReportDetail',
        name: 'channelReportDetail',
        component: () => import('@/views/statistical/channelReportDetail'),
        meta: { title: '渠道销售详情', requireAuth: true },
        hidden: true
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'system',
    alwaysShow: true,
    // redirect: '/reset-password',
    meta: { title: '系统设置', icon: 'yuechi' },
    children: [
      {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/views/system/password/reset-password'),
        meta: { title: '修改密码', requireAuth: true, roles: [1, 2, 3] }
      }
    ]
  },
  /*  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: '菜单1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: '菜单1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: '菜单1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: '菜单1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: '菜单1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: '菜单1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: '菜单2' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    // redirect: '/test/index',
    // name: 'test',
    children: [
      {
        path: 'index',
        name: 'test',
        component: () => import('@/views/test/index'),
        meta: { title: '测试', icon: 'form' }
      }
    ]
  },*/
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
