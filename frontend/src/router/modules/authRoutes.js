export default [
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfilePage.vue'),
  },
  {
    path: '/profile/edit',
    name: 'profileEdit',
    component: () => import('@/views/ProfileEditPage.vue'),
  },
]
