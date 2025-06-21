export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/search_result',
    name: 'search_result',
    component: () => import('@/views/SearchPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/edit',
    name: 'profileEdit',
    component: () => import('@/views/ProfileEdittingPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]
