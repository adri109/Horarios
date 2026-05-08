<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  fetchNotificationsRequest,
  markAllNotificationsAsReadRequest,
  markNotificationAsReadRequest,
} from '@/domains/notifications/api/notificationsApi';
import { useSocket } from '@/composables/useSocket';
import BaseButton from '@/components/ui/BaseButton.vue';
import { BRAND } from '@/config/branding';

const router = useRouter();
const { on, off } = useSocket();

const isDropdownOpen = ref(false);
const profileButton = ref(null);
const dropdownMenu = ref(null);

const user = JSON.parse(localStorage.getItem('user'));
const salonSlug = user?.salonSlug || null;
const salonName = user?.salonName || user?.salon?.name || 'Mi Salón';

console.log(user.name);

// Dropdown de notificaciones
const isNotificationOpen = ref(false);
const notificationButton = ref(null);
const notificationMenu = ref(null);

// Notificaciones
const notifications = ref([]);
const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
);
const hasNewNotification = computed(() => unreadCount.value > 0);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
  
  // Re-inicializar iconos después de que el dropdown se muestre
  if (isDropdownOpen.value && window.lucide) {
    setTimeout(() => {
      window.lucide.createIcons();
    }, 50);
  }
}

async function toggleNotificationDropdown() {
  isNotificationOpen.value = !isNotificationOpen.value;
  
  if (isNotificationOpen.value) {
    // Cargar notificaciones al abrir
    await fetchNotifications();
  }
}

// Cargar notificaciones
const fetchNotifications = async () => {
  try {
    const response = await fetchNotificationsRequest();
    notifications.value = response.data;
  } catch (error) {
    console.error('❌ Error cargando notificaciones:', error);
  }
};

// Marcar notificación como leída
const markAsRead = async (notificationId) => {
  try {
    await markNotificationAsReadRequest(notificationId);
    
    // Actualizar localmente
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  } catch (error) {
    console.error('❌ Error marcando notificación como leída:', error);
  }
};

// Marcar todas como leídas
const markAllAsRead = async () => {
  try {
    await markAllNotificationsAsReadRequest();
    
    // Actualizar localmente
    notifications.value.forEach(n => n.read = true);
  } catch (error) {
    console.error('❌ Error marcando todas como leídas:', error);
  }
};

// Formatear fecha relativa
const formatRelativeTime = (date) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor((now - notificationDate) / 1000);
  
  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  return notificationDate.toLocaleDateString();
};

// Obtener icono según tipo
const getNotificationIcon = (type) => {
  switch(type) {
    case 'REMINDER': return 'clock';
    case 'CANCELLATION': return 'x-circle';
    case 'PROMOTION': return 'gift';
    default: return 'bell';
  }
};

// Cerrar dropdowns al clicar fuera
function handleClickOutside(event) {
  if (
    profileButton.value &&
    !profileButton.value.contains(event.target) &&
    dropdownMenu.value &&
    !dropdownMenu.value.contains(event.target)
  ) {
    isDropdownOpen.value = false;
  }

  if (
    notificationButton.value &&
    !notificationButton.value.contains(event.target) &&
    notificationMenu.value &&
    !notificationMenu.value.contains(event.target)
  ) {
    isNotificationOpen.value = false;
  }
}

// Cerrar Sesión

const logout = () => {
  // Borrar token y datos del usuario
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirigir al login
  router.push('/login');
};

// Listener para nuevas notificaciones
const handleNewNotification = (notification) => {
  console.log('📬 Nueva notificación recibida:', notification);
  notifications.value.unshift(notification);
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
  
  // Inicializar iconos de Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Cargar notificaciones iniciales
  fetchNotifications();
  
  // Escuchar nuevas notificaciones via WebSocket
  on('new-notification', handleNewNotification);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
  off('new-notification', handleNewNotification);
});
</script>

<template>
  <header class="bg-white shadow-sm z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-3">
          <h2 class="text-2xl font-semibold text-gray-800" id="page-title">
            {{ BRAND.dashboardLabel }}
          </h2>
          <span class="text-gray-500 text-lg font-medium">|</span>
          <h3 class="text-lg font-semibold text-blue-600">
            {{ salonName }}
          </h3>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Notificaciones -->
          <div class="relative">
            <button
              ref="notificationButton"
              @click="toggleNotificationDropdown"
              class="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none relative transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-600 transition-transform duration-300"
                :class="{ 'animate-pulse-slow': hasNewNotification }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
              <span
                class="absolute top-1 right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-white text-xs font-semibold px-1"
                v-if="hasNewNotification"
              >
                {{ unreadCount }}
              </span>
            </button>

            <!-- Dropdown de notificaciones -->
            <div
              ref="notificationMenu"
              class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transform transition-all duration-300 origin-top-right max-h-96 overflow-y-auto"
              :class="{
                'opacity-100 scale-100 visible': isNotificationOpen,
                'opacity-0 scale-95 invisible': !isNotificationOpen,
              }"
            >
              <div class="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <p class="text-gray-700 text-sm font-semibold">
                  Notificaciones
                </p>
                <BaseButton
                  v-if="unreadCount > 0"
                  @click="markAllAsRead"
                  variant="ghost"
                  size="sm"
                  class="text-xs"
                >
                  Marcar todas como leídas
                </BaseButton>
              </div>
              
              <div v-if="notifications.length === 0" class="py-8 text-center">
                <p class="text-gray-400 text-sm">No tienes notificaciones</p>
              </div>
              
              <div v-else class="py-1">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  @click="markAsRead(notification.id)"
                  class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  :class="{ 'bg-blue-50': !notification.read }"
                >
                  <div class="flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-600">
                      <path v-if="getNotificationIcon(notification.type) === 'clock'" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else-if="getNotificationIcon(notification.type) === 'x-circle'" stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else-if="getNotificationIcon(notification.type) === 'gift'" stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-800 line-clamp-2">
                      {{ notification.message }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatRelativeTime(notification.sentAt) }}
                    </p>
                  </div>
                  <span
                    v-if="!notification.read"
                    class="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Avatar -->
          <div class="relative">
            <button
              ref="profileButton"
              @click="toggleDropdown"
              class="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold"
              >
                {{ user.name[0] }}{{ user.name[1] }}
              </div>
              <div class="hidden md:block text-left">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-medium text-gray-700">{{ user.name }}</p>
                  <span 
                    class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                    :class="user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                  >
                    {{ user.role === 'ADMIN' ? 'Admin' : 'Trabajador' }}
                  </span>
                </div>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
              <i
                data-lucide="chevron-down"
                class="w-4 h-4 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': isDropdownOpen }"
              ></i>
            </button>

            <div
              ref="dropdownMenu"
              class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transform transition-all duration-200 origin-top-right"
              :class="{
                'opacity-100 scale-100 visible': isDropdownOpen,
                'opacity-0 scale-95 invisible': !isDropdownOpen,
              }"
            >
              <!-- Contenido original del dropdown -->
              <div class="px-4 py-3 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                  >
                    {{ user.name[0] }}{{ user.name[1] }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-800 truncate">{{ user.name }}</p>
                    <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
                    <span 
                      class="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                      :class="user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                    >
                      {{ user.role === 'ADMIN' ? 'Administrador' : 'Trabajador' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="py-2">
                <a
                  v-if="salonSlug"
                  :href="`/salon/${salonSlug}`"
                  target="_blank"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
                >
                  <i data-lucide="store" class="w-4 h-4 mr-3"></i>
                  <div class="flex flex-col">
                    <span class="font-medium">Ver mi Salón</span>
                    <span class="text-xs text-gray-500 group-hover:text-blue-500">{{ salonSlug }}</span>
                  </div>
                  <i data-lucide="external-link" class="w-3 h-3 ml-auto text-gray-400"></i>
                </a>
                <a
                  href="#"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
                  <i data-lucide="settings" class="w-4 h-4 mr-3"></i>
                  Configuración
                </a>
                <a
                  href="#"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
                  <i data-lucide="bell" class="w-4 h-4 mr-3"></i>
                  Notificaciones
                </a>
                <a
                  href="#"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
                  <i data-lucide="help-circle" class="w-4 h-4 mr-3"></i>
                  Ayuda
                </a>
              </div>

              <div class="border-t border-gray-100 py-2">
                <button
                  type="button"
                  @click="logout"
                  class="flex w-full items-center px-4 py-2 text-left text-sm font-medium text-[#5b61d9] transition-colors duration-150 hover:text-[#583d8a]"
                >
                  <i data-lucide="log-out" class="mr-3 h-4 w-4 shrink-0"></i>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
          <!-- Fin Avatar -->
        </div>
      </div>
    </div>
  </header>
</template>

<style>
/* Animación pulse más suave */
@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s infinite;
}
</style>
