import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import ProductView from '../views/ProductView.vue'
import DefaultLayout from '../components/DefaultLayout.vue'
import AuthLayout from '../components/AuthLayout.vue'
import store from '../store';

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: DefaultLayout,
    meta: { requireAuth: true },
    children: [
      { path: '/home', name: 'HomeView', component: HomeView },
      { path: '/product/create', name: 'ProductCreate', component: ProductView, meta: { isAdmin: true } },
      { path: '/product/:id?', name: 'Product', component: ProductView },
    ]
  },
  {
    path: '/auth',
    redirect: '/login',
    name: 'Auth',
    component: AuthLayout,
    meta: { isGuest : true },
    children: [
      {
        path: '/login',
        name: 'LoginView',
        component: LoginView
      },
      {
        path: '/register',
        name: 'RegisterView',
        component: RegisterView
      },
    ]
  },
  { 
    path: '/:pathMatch(.*)*',
    redirect: '/home',
    name: 'NotFound',
    component: HomeView,
    meta: { isGuest: true }
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.meta.requireAuth && !store.state.user.token) {
    next({ name: 'LoginView' })
  } else if((store.state.user.token && to.meta.isGuest) || (to.meta.isAdmin && store.state.user.data.privileges != 1 )) {
    next({ name: 'HomeView' })
  } else {
    next()
  }
})

export default router
