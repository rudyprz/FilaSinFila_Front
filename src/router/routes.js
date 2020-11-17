
const routes = [
  {
    path: '/',
    component: () => import('layouts/Init.vue'),
    children: [
      { path: '', component: () => import('pages/Landing.vue') },
      { path: '/Register', component: () => import('pages/Register.vue') },
      { path: '/Login', component: () => import('pages/Login.vue') },
      { path: '/resetPass/:id', component: () => import('pages/ResetPass.vue') }
    ]
  },
  {
    path: '/Home',
    component: () => import('layouts/LayoutU.vue'),
    children: [
      { path: '', component: () => import('pages/User/Home.vue') },
      { path: '/Rate', component: () => import('pages/User/Rate.vue') },
      { path: '/Turn/:id', component: () => import('pages/User/Turn.vue') },
      { path: '/Welcome/:id', component: () => import('pages/User/Welcome.vue') }
    ]
  },
  {
    path: '/HomeB',
    component: () => import('layouts/LayoutB.vue'),
    children: [
      { path: '', component: () => import('pages/Business/HomeB.vue') }
    ]
  },
  {
    path: '/HomeA',
    component: () => import('layouts/LayoutA.vue'),
    children: [
      { path: '', component: () => import('pages/Business/HomeA.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
