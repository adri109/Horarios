<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Personal</h1>
        <p class="text-gray-600 mt-1">Gestiona tu equipo de trabajo</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
      >
        <span class="text-xl">+</span>
        Agregar Trabajador
      </button>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Total Personal</p>
            <p class="text-3xl font-bold mt-1">{{ workers.length }}</p>
          </div>
          <div class="text-5xl opacity-30">👥</div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">Activos</p>
            <p class="text-3xl font-bold mt-1">{{ workers.length }}</p>
          </div>
          <div class="text-5xl opacity-30">✓</div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">Roles</p>
            <p class="text-3xl font-bold mt-1">Trabajadores</p>
          </div>
          <div class="text-5xl opacity-30">🎯</div>
        </div>
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="bg-white rounded-xl shadow-md p-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre o email..."
        class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      <p class="mt-4 text-gray-600">Cargando personal...</p>
    </div>

    <!-- Lista de trabajadores -->
    <div v-else-if="filteredWorkers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="worker in filteredWorkers"
        :key="worker.id"
        class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border-l-4 border-purple-500"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {{ worker.name ? worker.name.charAt(0).toUpperCase() : '?' }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">{{ worker.name || 'Sin nombre' }}</h3>
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                {{ worker.role }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-2 text-sm text-gray-600 mb-4">
          <div class="flex items-center gap-2">
            <span>📧</span>
            <span>{{ worker.email }}</span>
          </div>
          <div v-if="worker.phone" class="flex items-center gap-2">
            <span>📱</span>
            <span>{{ worker.phone }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>📅</span>
            <span>{{ formatDate(worker.createdAt) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="openEditModal(worker)"
            class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            Editar
          </button>
          <button
            @click="confirmDelete(worker)"
            class="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else class="text-center py-12 bg-white rounded-xl shadow-md">
      <div class="text-6xl mb-4">🔍</div>
      <p class="text-gray-600 text-lg">No se encontraron trabajadores</p>
    </div>

    <!-- Modal Crear/Editar Worker -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModals"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-purple-600">
            {{ showEditModal ? 'Editar Trabajador' : 'Nuevo Trabajador' }}
          </h3>
          <button @click="closeModals" class="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <form @submit.prevent="showEditModal ? updateWorker() : createWorker()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="trabajador@ejemplo.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {{ showEditModal ? '(dejar vacío para mantener)' : '*' }}
            </label>
            <input
              v-model="formData.password"
              type="password"
              :required="!showEditModal"
              minlength="6"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              v-model="formData.phone"
              type="tel"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="+34 600 000 000"
            />
          </div>

          <!-- Permisos -->
          <div class="border-t pt-4 mt-4">
            <h4 class="font-semibold text-gray-700 mb-3">Permisos</h4>
            
            <div class="space-y-3">
              <!-- Clientes -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2">👥 Clientes</p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewClients" class="rounded">
                    Ver clientes
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canEditClients" class="rounded">
                    Editar clientes
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canDeleteClients" class="rounded">
                    Eliminar clientes
                  </label>
                </div>
              </div>

              <!-- Personal -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2">👔 Personal</p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewPersonal" class="rounded">
                    Ver personal
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canEditPersonal" class="rounded">
                    Editar personal
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canDeletePersonal" class="rounded">
                    Eliminar personal
                  </label>
                </div>
              </div>

              <!-- Servicios -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2">💇 Servicios</p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewServices" class="rounded">
                    Ver servicios
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canEditServices" class="rounded">
                    Editar servicios
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canDeleteServices" class="rounded">
                    Eliminar servicios
                  </label>
                </div>
              </div>

              <!-- Inventario -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2">📦 Inventario</p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewInventory" class="rounded">
                    Ver inventario
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canEditInventory" class="rounded">
                    Editar inventario
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canDeleteInventory" class="rounded">
                    Eliminar inventario
                  </label>
                </div>
              </div>

              <!-- Citas -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2">📅 Citas</p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canConfirmAppointments" class="rounded">
                    Confirmar citas
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canCancelAppointments" class="rounded">
                    Cancelar citas
                  </label>
                  <p class="text-xs text-gray-500 mt-2">
                    ℹ️ Completar y marcar "no asistió" siempre permitido
                  </p>
                </div>
              </div>

              <!-- Otros -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2">📊 Otros</p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewReports" class="rounded">
                    Ver informes
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewMarketing" class="rounded">
                    Ver marketing
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje de error -->
          <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

          <!-- Mensaje de éxito -->
          <p v-if="formSuccess" class="text-green-600 text-sm">✓ {{ formSuccess }}</p>

          <button
            type="submit"
            class="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:shadow-lg transition disabled:opacity-50"
            :disabled="formLoading"
          >
            {{ formLoading ? 'Guardando...' : (showEditModal ? 'Actualizar' : 'Crear Trabajador') }}
          </button>
        </form>
      </div>
    </div>

    <!-- Modal Confirmar Eliminación -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">¿Eliminar trabajador?</h3>
          <p class="text-gray-600">
            ¿Estás seguro de que deseas eliminar a <strong>{{ workerToDelete?.name }}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            @click="deleteWorker"
            class="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            :disabled="formLoading"
          >
            {{ formLoading ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Estado
const workers = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const workerToDelete = ref(null);
const editingWorker = ref(null);

// Formulario
const formData = ref({
  email: '',
  password: '',
  name: '',
  phone: '',
  permissions: {
    canViewClients: true,
    canEditClients: false,
    canDeleteClients: false,
    canViewPersonal: false,
    canEditPersonal: false,
    canDeletePersonal: false,
    canViewServices: true,
    canEditServices: false,
    canDeleteServices: false,
    canViewInventory: false,
    canEditInventory: false,
    canDeleteInventory: false,
    canViewReports: false,
    canViewMarketing: false,
    canConfirmAppointments: false,
    canCancelAppointments: false,
  },
});
const formLoading = ref(false);
const formError = ref('');
const formSuccess = ref('');

// Computed
const filteredWorkers = computed(() => {
  if (!searchQuery.value) return workers.value;
  
  const query = searchQuery.value.toLowerCase();
  return workers.value.filter(w => 
    w.name?.toLowerCase().includes(query) || 
    w.email.toLowerCase().includes(query) ||
    w.phone?.includes(query)
  );
});

// Cargar trabajadores
const loadWorkers = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/workers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    workers.value = response.data.workers || [];
  } catch (error) {
    console.error('Error al cargar trabajadores:', error);
    if (error.response?.status === 403) {
      alert('Solo los administradores pueden ver el personal');
    }
  } finally {
    loading.value = false;
  }
};

// Crear trabajador
const createWorker = async () => {
  formLoading.value = true;
  formError.value = '';
  formSuccess.value = '';

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/workers`, formData.value, {
      headers: { Authorization: `Bearer ${token}` }
    });

    workers.value.push(response.data.worker);
    formSuccess.value = 'Trabajador creado exitosamente';
    
    setTimeout(() => {
      closeModals();
    }, 1500);
  } catch (error) {
    formError.value = error.response?.data?.error || 'Error al crear trabajador';
  } finally {
    formLoading.value = false;
  }
};

// Abrir modal de edición
const openEditModal = (worker) => {
  editingWorker.value = worker;
  formData.value = {
    email: worker.email,
    password: '',
    name: worker.name || '',
    phone: worker.phone || '',
    permissions: {
      canViewClients: worker.canViewClients || false,
      canEditClients: worker.canEditClients || false,
      canDeleteClients: worker.canDeleteClients || false,
      canViewPersonal: worker.canViewPersonal || false,
      canEditPersonal: worker.canEditPersonal || false,
      canDeletePersonal: worker.canDeletePersonal || false,
      canViewServices: worker.canViewServices || false,
      canEditServices: worker.canEditServices || false,
      canDeleteServices: worker.canDeleteServices || false,
      canViewInventory: worker.canViewInventory || false,
      canEditInventory: worker.canEditInventory || false,
      canDeleteInventory: worker.canDeleteInventory || false,
      canViewReports: worker.canViewReports || false,
      canViewMarketing: worker.canViewMarketing || false,
      canConfirmAppointments: worker.canConfirmAppointments || false,
      canCancelAppointments: worker.canCancelAppointments || false,
    },
  };
  showEditModal.value = true;
};

// Actualizar trabajador
const updateWorker = async () => {
  formLoading.value = true;
  formError.value = '';
  formSuccess.value = '';

  try {
    const token = localStorage.getItem('token');
    const dataToSend = { ...formData.value };
    
    // No enviar password vacío
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    const response = await axios.put(
      `${API_URL}/workers/${editingWorker.value.id}`,
      dataToSend,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Actualizar en la lista
    const index = workers.value.findIndex(w => w.id === editingWorker.value.id);
    if (index !== -1) {
      workers.value[index] = response.data.worker;
    }

    formSuccess.value = 'Trabajador actualizado exitosamente';
    
    setTimeout(() => {
      closeModals();
    }, 1500);
  } catch (error) {
    formError.value = error.response?.data?.error || 'Error al actualizar trabajador';
  } finally {
    formLoading.value = false;
  }
};

// Confirmar eliminación
const confirmDelete = (worker) => {
  workerToDelete.value = worker;
  showDeleteModal.value = true;
};

// Eliminar trabajador
const deleteWorker = async () => {
  formLoading.value = true;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/workers/${workerToDelete.value.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    workers.value = workers.value.filter(w => w.id !== workerToDelete.value.id);
    showDeleteModal.value = false;
    workerToDelete.value = null;
  } catch (error) {
    alert(error.response?.data?.error || 'Error al eliminar trabajador');
  } finally {
    formLoading.value = false;
  }
};

// Cerrar modales
const closeModals = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingWorker.value = null;
  formData.value = {
    email: '',
    password: '',
    name: '',
    phone: '',
    permissions: {
      canViewClients: true,
      canEditClients: false,
      canDeleteClients: false,
      canViewPersonal: false,
      canEditPersonal: false,
      canDeletePersonal: false,
      canViewServices: true,
      canEditServices: false,
      canDeleteServices: false,
      canViewInventory: false,
      canEditInventory: false,
      canDeleteInventory: false,
      canViewReports: false,
      canViewMarketing: false,
      canConfirmAppointments: false,
      canCancelAppointments: false,
    },
  };
  formError.value = '';
  formSuccess.value = '';
};

// Formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Cargar al montar
onMounted(() => {
  loadWorkers();
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
