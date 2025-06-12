import publicRoutes from './modules/publicRoutes'
import authRoutes from './modules/authRoutes'

const errorRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '頁面不存在',
    },
  },
]

export default [...errorRoutes, ...publicRoutes, ...authRoutes]
