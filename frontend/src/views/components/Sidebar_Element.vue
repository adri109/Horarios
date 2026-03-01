<script setup>
import { computed } from 'vue';
import { BRAND } from '@/config/branding';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle']);

// Obtener permisos del usuario desde localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');
const permissions = user.permissions || {};
const isAdmin = user.role === 'ADMIN';

// Computed properties para visibilidad de pestañas
const canViewClients = computed(() => isAdmin || permissions.canViewClients);
const canViewPersonal = computed(() => isAdmin || permissions.canViewPersonal);
const canViewServices = computed(() => isAdmin || permissions.canViewServices);
const canViewInventory = computed(() => isAdmin || permissions.canViewInventory);
const canViewReports = computed(() => isAdmin || permissions.canViewReports);
const canViewMarketing = computed(() => isAdmin || permissions.canViewMarketing);
</script>

<template>
  <div
    :class="[
      'sidebar flex-shrink-0 hidden md:block h-full overflow-y-auto text-white',
      { 'is-collapsed': props.collapsed }
    ]"
  >
    <div class="p-4 md:p-5">
      <div class="sidebar-top">
        <div class="brand-wrap">
          <h1 v-if="!props.collapsed" class="text-2xl font-bold">{{ BRAND.appName }}</h1>
        </div>
        <button
          class="toggle-btn"
          @click="emit('toggle')"
          :title="props.collapsed ? 'Expandir menú' : 'Recoger menú'"
          type="button"
        >
          <svg v-if="!props.collapsed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5 15.75 12l-7.5 7.5" />
          </svg>
        </button>
      </div>
      <nav>
        <ul>
          <!-- dashboard -->
          <li class="mb-4">
            <router-link
              to="/dashboard/resume"
              class="sidebar-nav-link flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              exact-active-class="bg-white bg-opacity-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              <span v-if="!props.collapsed">{{ BRAND.dashboardLabel }}</span>
            </router-link>
          </li>

          <!-- citas -->
          <li class="mb-4">
            <router-link
              to="/dashboard/citas"
              class="sidebar-nav-link flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              exact-active-class="bg-white bg-opacity-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span v-if="!props.collapsed">Citas</span>
            </router-link>
          </li>

          <!-- clientes -->
          <li v-if="canViewClients" class="mb-4">
            <router-link
              to="/dashboard/clientes"
              class="sidebar-nav-link flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              active-class="bg-white bg-opacity-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
              <span v-if="!props.collapsed">Clientes</span>
            </router-link>
          </li>

          <!-- personal -->
          <li v-if="canViewPersonal" class="mb-4">
            <router-link
              to="/dashboard/personal"
              class="sidebar-nav-link flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              active-class="bg-white bg-opacity-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm-7.5 9.75a7.5 7.5 0 0 1 12-6m-.75.75h4.5a.75.75 0 0 1 .75.75v4.5h-6v-4.5a.75.75 0 0 1 .75-.75Zm1.125 0V13.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5"
                ></path>
              </svg>
              <span v-if="!props.collapsed">Personal</span>
            </router-link>
          </li>

          <!-- servicios -->
          <li v-if="canViewServices" class="mb-4">
            <router-link
              to="/dashboard/servicios"
              class="sidebar-nav-link flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              active-class="bg-white bg-opacity-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                ></path>
              </svg>
              <span v-if="!props.collapsed">Servicios</span>
            </router-link>
          </li>

          <!-- inventario -->
          <li v-if="canViewInventory" class="mb-4">
            <router-link
              to="/dashboard/inventario"
              class="sidebar-nav-link flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              active-class="bg-white bg-opacity-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                ></path>
              </svg>
              <span v-if="!props.collapsed">Inventario</span>
            </router-link>
          </li>

          <!-- informes -->
          <li v-if="canViewReports" class="mb-4">
            <router-link
              to="/dashboard/informes"
              class="sidebar-nav-link flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              active-class="bg-white bg-opacity-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <span v-if="!props.collapsed">Informes</span>
            </router-link>
          </li>

          <!-- marketing -->
          <li v-if="canViewMarketing" class="mb-4">
            <router-link
              to="/dashboard/marketing"
              class="sidebar-nav-link flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              active-class="bg-white bg-opacity-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                ></path>
              </svg>
              <span v-if="!props.collapsed">Marketing</span>
            </router-link>
          </li>

          <!-- configuracion (solo ADMIN) -->
          <li v-if="isAdmin" class="mb-4">
            <router-link
              to="/dashboard/configuracion"
              class="sidebar-nav-link flex items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              active-class="bg-white bg-opacity-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-1.054 3.31.826 2.28 2.47a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c1.054 1.543-.826 3.31-2.47 2.28a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543 1.054-3.31-.826-2.28-2.47a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-1.054-1.543.826-3.31 2.47-2.28.996.362 2.093-.16 2.572-1.065z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span v-if="!props.collapsed">Configuración</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 16rem;
  transition: width 0.2s ease;
}

.sidebar.is-collapsed {
  width: 5.25rem;
}

.sidebar.is-collapsed .sidebar-top {
  justify-content: center;
}

.sidebar.is-collapsed .brand-wrap {
  display: none;
}

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.brand-wrap {
  display: flex;
  align-items: center;
  min-width: 0;
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar.is-collapsed .toggle-btn {
  margin: 0 auto;
}

.sidebar-nav-link {
  min-height: 2.5rem;
  transition: all 0.2s ease;
}

.sidebar.is-collapsed .sidebar-nav-link {
  justify-content: center;
}

.sidebar.is-collapsed .sidebar-nav-link svg {
  margin-right: 0;
}
</style>
