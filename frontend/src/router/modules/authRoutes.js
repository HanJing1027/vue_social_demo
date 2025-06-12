export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/search_result',
    name: 'search_result',
    component: () => import('@/views/SearchPage.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfilePage.vue'),
  },
  {
    path: '/profile/edit',
    name: 'profileEdit',
    component: () => import('@/views/ProfileEdittingPage.vue'),
  },
]
