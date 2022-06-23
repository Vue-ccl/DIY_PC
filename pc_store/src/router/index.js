import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { x: 0, y: 0 ,showBottomTabBar:true},
    redirect: to => {
      const { hash, params, query } = to
      // console.log(params);
      return params.fullpath
    },
    children: [
      {
        path: 'hot',
        name: 'Hot', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Hot/Hot.vue')
      },
      {
        path: 'cpu',
        name: 'Cpu', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Cpu.vue')
      },
      {
        path: 'gpu',
        name: 'Gpu', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Gpu.vue')
      },
      {
        path: 'mobo',
        name: 'Mobo', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Mobo.vue')
      },
      {
        path: 'ddr',
        name: 'Ddr', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Ddr.vue')
      },
      {
        path: 'hdd',
        name: 'Hdd', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Hdd.vue')
      },
      {
        path: 'power',
        name: 'Power', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Power.vue')
      },
      {
        path: 'radiator',
        name: 'Radiator', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Radiator.vue')
      },
      {
        path: 'pc',
        name: 'Pc', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Pc.vue')
      },
      {
        path: 'monitor',
        name: 'Monitor', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Monitor.vue')
      },
      {
        path: 'keyboard',
        name: 'Keyboard', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Keyboard.vue')
      },
      {
        path: 'mouse',
        name: 'Mouse', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Mouse.vue')
      },
      {
        path: 'sound',
        name: 'Sound', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Sound.vue')
      },
      {
        path: 'headset',
        name: 'Headset', meta: { showBottomTabBar: true },
        component: () => import('../views/Home/Children/Headset.vue')
      },
      {
        path: '/home',
        redirect: '/home/hot'
      },
    ]
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/Detail/Detail.vue'), meta: { showBottomTabBar: false },
  },
  {
    path: '/media',
    name: 'Media',
    component: () => import('../views/Media/Media.vue'), meta: { showBottomTabBar: false },
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('../views/Forum/Forum.vue'),meta: { showBottomTabBar: true }
  },
  {
    path: '/diy',
    name: 'Diy',
    component: () => import('../views/Diy/Diy.vue'),
    beforeEnter: (to, from, next) => {
      if (to.query.dt == 1) {
        to.meta.showBottomTabBar = false
      } else {
        to.meta.showBottomTabBar = true
      }
      next()
    }
  },
  {
    path: '/collection',
    name: 'Collection',
    component: () => import('../views/Collection/Collection.vue'),
    beforeEnter: (to, from, next) => {
      if (to.query.dt == 1) {
        to.meta.showBottomTabBar = false
      } else {
        to.meta.showBottomTabBar = true
      }
      next()
    }
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('../views/Me/Me.vue'),meta: { showBottomTabBar: true }
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('../views/My/My.vue'),meta: { showBottomTabBar: false }
  },
  {
    path: '/myforum',
    name: 'MyForum',
    component: () => import('../views/MyForum/MyForum.vue'),meta: { showBottomTabBar: false },
  },
  {
    path: '/mycomments',
    name: 'MyComments',
    component: () => import('../views/MyComments/MyComments.vue'),meta: { showBottomTabBar: false },
  },
  {
    path: '/mytag',
    name: 'MyTag',
    component: () => import('../views/MyTag/MyTag.vue'),meta: { showBottomTabBar: false },
  },
  {
    path: '/pay',
    name: 'Pay',
    component: () => import('../views/Pay/Pay.vue'),meta: { showBottomTabBar: false },
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order/Order.vue'),meta: { showBottomTabBar: false },
  },
  {
    path: '/myaddress',
    name: 'MyAddress',
    component: () => import('../views/MyAddress/MyAddress.vue'),meta: { showBottomTabBar: false }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search/Search.vue'), meta: { showBottomTabBar: false }
  },
  {
    path: '/topsales',
    name: 'TopSales',
    component: () => import('../views/TopSales/TopSales.vue'), meta: { showBottomTabBar: false }
  },
  {
    path: '/login',
    name: 'Login',
    meta:{auth:true},
    component: () => import('../views/Login/Login.vue'), meta: { showBottomTabBar: false }
  },

]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.name == 'Detail') {
      return { x: 0, y: 0 }
    } else {
      return to.meta;
    }

  }
})

export default router
