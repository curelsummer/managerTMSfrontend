import Vue from 'vue'
import Router from 'vue-router'
import MenuView from '@/views/common/MenuView'
import PageView from '@/views/common/PageView'
import LoginView from '@/views/login/Common'
import EmptyPageView from '@/views/common/EmptyPageView'
import HomePageView from '@/views/HomePage'
import db from 'utils/localstorage'
import request from 'utils/request'

Vue.use(Router)

let constRouter = [
  {
    path: '/login',
    name: '登录页',
    component: LoginView
  },
  {
    path: '/index',
    name: '首页',
    redirect: '/home'
  }
]

let router = new Router({
  routes: constRouter
})

const whiteList = ['/login']

let asyncRouter

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  }
  let token = db.get('USER_TOKEN')
  let user = db.get('USER')
  let userRouter = get('USER_ROUTER')
  if (token.length && user) {
    if (!asyncRouter) {
      if (!userRouter) {
        request.get(`menu/${user.username}`).then((res) => {
          asyncRouter = res.data
          save('USER_ROUTER', asyncRouter)
          go(to, next)
        })
      } else {
        asyncRouter = userRouter
        go(to, next)
      }
    } else {
      next()
    }
  } else {
    next('/login')
  }
})

function go (to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  router.addRoutes(asyncRouter)
  next({...to, replace: true})
}

function save (name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

function get (name) {
  return JSON.parse(localStorage.getItem(name))
}

function filterAsyncRouter (routes) {
  return routes.filter((route) => {
    let component = route.component
    if (component) {
      switch (route.component) {
        case 'MenuView':
          route.component = MenuView
          break
        case 'PageView':
          route.component = PageView
          break
        case 'EmptyPageView':
          route.component = EmptyPageView
          break
        case 'HomePageView':
          route.component = HomePageView
          break
        default:
          route.component = view(component)
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
  })
}

function view (path) {
  return function (resolve) {
    import(`@/views/${path}.vue`).then(mod => {
      resolve(mod)
    }).catch(err => {
      console.error(`Failed to load component: @/views/${path}.vue`, err)
      // 尝试使用默认的错误页面或者返回一个简单的组件
      resolve({
        template: '<div>页面加载失败，请检查路由配置</div>'
      })
    })
  }
}

export default router
