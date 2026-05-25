import { createRouter, createWebHistory } from 'vue-router';

const Landing = () => import('../views/Landing_Page.vue');
const Login = () => import('../views/Login_Page.vue');
const Register = () => import('../views/Register_Page.vue');
const Dashboard = () => import('../views/Dashboard_Page.vue');
const ResetPassword = () => import('../views/ResetPassword_Page.vue');
const TechInfo = () => import('../views/TechInfo_Page.vue');
const SalonPublicPage = () => import('../views/SalonPublicPage.vue');

const Citas = () => import('../views/dashboard/Citas_Element.vue');
const Clientes = () => import('../views/dashboard/Clientes_Element.vue');
const Personal = () => import('../views/dashboard/Personal_Element.vue');
const Servicios = () => import('../views/dashboard/Servicios_Element.vue');
const Inventario = () => import('../views/dashboard/Inventario_Element.vue');
const Informes = () => import('../views/dashboard/Informes_Element.vue');
const Marketing = () => import('../views/dashboard/Marketing_Element.vue');
const Configuracion = () => import('../views/dashboard/Configuracion_Element.vue');
const Resume = () => import('../views/dashboard/Resume_Element.vue');

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guest: true },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { guest: true },
  },
  {
    path: '/tech-info',
    name: 'TechInfo',
    component: TechInfo,
  },

  {
    path: '/salon/:slug',
    name: 'SalonPublic',
    component: SalonPublicPage,
    props: true,
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard/resume' },
      { path: 'resume', component: Resume },
      { path: 'citas', component: Citas },
      { path: 'clientes', component: Clientes },
      { path: 'personal', component: Personal },
      { path: 'servicios', component: Servicios },
      { path: 'inventario', component: Inventario },
      { path: 'informes', component: Informes },
      { path: 'marketing', component: Marketing },
      { path: 'configuracion', component: Configuracion },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.guest && token) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
