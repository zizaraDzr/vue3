import type { RouteParams, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import { isAuthorized } from './store/user';

export type AppRouteNames =
  | 'global-feed'
  | 'my-feed'
  | 'tag'
  | 'article'
  | 'create-article'
  | 'edit-article'
  | 'login'
  | 'register'
  | 'profile'
  | 'profile-favorites'
  | 'settings';

export const routes: RouteRecordRaw[] = [
  {
    name: 'global-feed',
    path: '/',
    component: Home,
  },
  {
    name: 'my-feed',
    path: '/my-feeds',
    component: Login,
  },
  {
    name: 'tag',
    path: '/tag/:tag',
    component: Home,
  },
  {
    name: 'profile',
    path: '/profile/:username',
    component: Home,
  },
  {
    name: 'article',
    path: '/slug/:slug',
    component: Home,
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('./pages/Login.vue'),
    beforeEnter: () => !isAuthorized(),
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('./pages/Register.vue'),
    beforeEnter: () => !isAuthorized(),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export function routerPush(
  name: AppRouteNames,
  params?: RouteParams
): ReturnType<typeof router.push> {
  return params === undefined ? router.push({ name }) : router.push({ name, params });
}
