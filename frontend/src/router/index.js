import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login_Page.vue';
import Register from '../views/Register_Page.vue';
import Dashboard from '../views/Dashboard_Page.vue';
import ResetPassword from '../views/ResetPassword_Page.vue';

// Páginas hijas de Dashboard
import Citas from '../views/dashboard/Citas_Element.vue';
import Clientes from '../views/dashboard/Clientes_Element.vue';
import Personal from '../views/dashboard/Personal_Element.vue';
import Servicios from '../views/dashboard/Servicios_Element.vue';
import Inventario from '../views/dashboard/Inventario_Element.vue';
import Informes from '../views/dashboard/Informes_Element.vue';
import Marketing from '../views/dashboard/Marketing_Element.vue';
import Configuracion from '../views/dashboard/Configuracion_Element.vue';
import Resume from '../views/dashboard/Resume_Element.vue';

// Página pública de salón
import SalonPublicPage from '../views/SalonPublicPage.vue';

const routes = [
  { path: '', redirect: '/login' },
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

  // Ruta pública dinámica por slug
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

// Protección de rutas
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
