<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const isDropdownOpen = ref(false);
const profileButton = ref(null);
const dropdownMenu = ref(null);

const user = JSON.parse(localStorage.getItem('user'));
const salonSlug = user?.salonSlug || null;
const salonName = user?.salonName || user?.salon?.name || 'Mi Salón';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

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
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    notifications.value = response.data;
  } catch (error) {
    console.error('❌ Error cargando notificaciones:', error);
  }
};

// Marcar notificación como leída
const markAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
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
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/notifications/read-all`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
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
    case 'REMINDER': return '⏰';
    case 'CANCELLATION': return '❌';
    case 'PROMOTION': return '🎉';
    default: return '📢';
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

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
  
  // Inicializar iconos de Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Cargar notificaciones iniciales
  fetchNotifications();
  
  // Actualizar notificaciones cada 30 segundos
  const interval = setInterval(fetchNotifications, 30000);
  
  // Limpiar interval al desmontar
  onBeforeUnmount(() => {
    clearInterval(interval);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="bg-white shadow-sm z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-3">
          <h2 class="text-2xl font-semibold text-gray-800" id="page-title">
            Dashboard
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
                  stroke-width="2"
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
                <button
                  v-if="unreadCount > 0"
                  @click="markAllAsRead"
                  class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Marcar todas como leídas
                </button>
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
                  <span class="text-2xl">{{ getNotificationIcon(notification.type) }}</span>
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
                  @click="logout"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 text-left"
                >
                  <i data-lucide="log-out" class="w-4 h-4 mr-3"></i>
                  Cerrar Sesión
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
