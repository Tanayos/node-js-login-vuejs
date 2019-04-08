import Vue from 'vue'
import VueRouter from 'vue-router'

import WelcomePage from './components/welcome/welcome.vue'
import DashboardPage from './components/dashboard/dashboard.vue'
import SignupPage from './components/auth/signup.vue'
import SigninPage from './components/auth/signin.vue'
import Logout from './components/auth/logout.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/',
    component: WelcomePage,
    // meta : {
    //   requiresVistor : true
    // }
  },
  { path: '/signup',
    component: SignupPage,
    meta : {
      requiresVistor : true
    }
  },
  { path: '/signin',
    component: SigninPage,
    meta : {
      requiresVistor : true
    }
  },
  { path: '/logout',
  component: Logout,
  meta : {
    requiresAuth: true
  }
},
  { path: '/dashboard',
    component: DashboardPage,
    meta: {
      requiresAuth: true
    }
  }
]

export default new VueRouter({mode: 'history', routes})