import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// Views
const Home = () => import('@/views/Home.vue');
const Login = () => import('@/views/Login.vue');
const Register = () => import('@/views/Register.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const Activities = () => import('@/views/Activities.vue');
const Friends = () => import('@/views/Friends.vue');
const Admin = () => import('@/views/Admin/index.vue');
const Profile = () => import('@/views/Profile.vue');
const NotFound = () => import('@/views/NotFound.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities,
    meta: { requiresAuth: true }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: Friends,
    meta: { requiresAuth: true }
  },
  {
    path: '/friends/:id',
    name: 'FriendActivities',
    component: () => import('@/views/FriendActivities.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  await store.dispatch('auth/initAuth');
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin'];

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
