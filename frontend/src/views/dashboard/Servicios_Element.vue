<template>
  <div class="p-4 flex justify-center">
    <div class="w-full max-w-4xl">
      <section
        class="bg-white rounded-2xl shadow-md p-4 max-h-[600px] overflow-y-auto scrollbar-hidden"
      >
        <h2 class="text-lg font-semibold text-purple-700 mb-4">Servicios</h2>

        <div v-if="loading" class="text-gray-500">Cargando servicios...</div>
        <div v-else-if="services.length === 0" class="text-gray-400">
          No hay servicios registrados
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="service in services"
            :key="service.id"
            class="bg-gray-50 rounded-xl shadow p-4 flex justify-between items-center border border-gray-200"
          >
            <div>
              <h3 class="font-semibold text-gray-800">{{ service.name }}</h3>
              <p class="text-gray-600 text-sm">{{ service.description }}</p>
            </div>
            <div
              class="text-gray-700 text-sm text-right flex flex-col items-end space-y-1"
            >
              <div>€{{ service.price }}</div>
              <div>{{ service.duration }} min</div>
              <div class="flex space-x-2 mt-2">
                <button
                  @click="editService(service)"
                  class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg hover:from-purple-600 hover:to-pink-600 transition shadow-md"
                >
                  <i class="fas fa-edit mr-1"></i>Editar
                </button>
                <button
                  @click="deleteService(service.id)"
                  class="bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1 rounded-lg hover:from-red-600 hover:to-rose-600 transition shadow-md"
                >
                  <i class="fas fa-trash mr-1"></i>Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón para abrir modal -->
        <button
          @click="openModal()"
          class="mt-6 bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition shadow"
        >
          + Añadir Servicio
        </button>
      </section>
    </div>

    <!-- Modal Crear/Editar Servicio -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        <h2 class="text-xl font-bold mb-4 text-purple-700">
          {{ editingService ? 'Editar Servicio' : 'Crear Servicio' }}
        </h2>
        <button
          @click="closeModal()"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <form @submit.prevent="saveService" class="space-y-4">
          <div>
            <label class="block font-medium mb-1 text-gray-700">Nombre</label>
            <input
              v-model="newService.name"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label class="block font-medium mb-1 text-gray-700"
              >Descripción</label
            >
            <textarea
              v-model="newService.description"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-medium mb-1 text-gray-700"
                >Precio (€)</label
              >
              <input
                v-model.number="newService.price"
                type="number"
                min="0"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label class="block font-medium mb-1 text-gray-700"
                >Duración (min)</label
              >
              <input
                v-model.number="newService.duration"
                type="number"
                min="1"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            class="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition w-full shadow"
          >
            {{ editingService ? 'Actualizar Servicio' : 'Guardar Servicio' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const services = ref([]);
const newService = ref({ name: '', description: '', price: 0, duration: 30 });
const showModal = ref(false);
const editingService = ref(null);
const loading = ref(true);

const salonId = JSON.parse(localStorage.getItem('user'))?.salon?.id;

// Cargar servicios
const fetchServices = async () => {
  loading.value = true;
  try {
    console.log('📤 Cargando servicios...');
    
    const token = localStorage.getItem('token');
    console.log('🔑 Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NULL');
    
    if (!token) {
      console.error('❌ No hay token de autenticación');
      alert('No estás autenticado. Por favor, inicia sesión nuevamente.');
      loading.value = false;
      return;
    }
    
    console.log('📡 Enviando petición a:', `${API_URL}/services`);
    console.log('📡 Con header Authorization:', `Bearer ${token.substring(0, 20)}...`);
    
    const res = await axios.get(`${API_URL}/services`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Servicios cargados:', res.data);
    services.value = res.data || [];
  } catch (error) {
    console.error('❌ Error cargando servicios:', error);
    if (axios.isAxiosError(error)) {
      console.error('❌ Respuesta del servidor:', error.response?.data);
    }
    alert('No se pudieron cargar los servicios');
  } finally {
    loading.value = false;
  }
};

// Abrir modal para crear
const openModal = () => {
  newService.value = { name: '', description: '', price: 0, duration: 30 };
  editingService.value = null;
  showModal.value = true;
};

// Cerrar modal
const closeModal = () => {
  showModal.value = false;
  editingService.value = null;
};

// Guardar servicio (crear o actualizar)
const saveService = async () => {
  try {
    const token = localStorage.getItem('token');
    let res;
    if (editingService.value) {
      // Actualizar
      console.log('📤 Actualizando servicio:', editingService.value.id);
      res = await axios.put(
        `${API_URL}/services/${editingService.value.id}`,
        newService.value,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const index = services.value.findIndex(
        (s) => s.id === editingService.value.id
      );
      if (index !== -1) services.value[index] = res.data;
      console.log('✅ Servicio actualizado');
    } else {
      // Crear
      console.log('📤 Creando servicio nuevo');
      res = await axios.post(`${API_URL}/services`, { ...newService.value, salonId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      services.value.push(res.data);
      console.log('✅ Servicio creado');
    }
    closeModal();
  } catch (error) {
    console.error('❌ Error guardando el servicio:', error);
    if (axios.isAxiosError(error)) {
      console.error('❌ Respuesta del servidor:', error.response?.data);
    }
    alert('Error guardando el servicio');
  }
};

// Editar servicio
const editService = (service) => {
  newService.value = { ...service };
  editingService.value = service;
  showModal.value = true;
};

// Eliminar servicio
const deleteService = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
  try {
    console.log('📤 Eliminando servicio:', id);
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/services/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    services.value = services.value.filter((s) => s.id !== id);
    console.log('✅ Servicio eliminado');
  } catch (error) {
    console.error('❌ Error eliminando servicio:', error);
    if (axios.isAxiosError(error)) {
      console.error('❌ Respuesta del servidor:', error.response?.data);
    }
    alert('Error eliminando el servicio');
  }
};

onMounted(() => {
  fetchServices();
});
</script>

<style scoped>
.scrollbar-hidden {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.scrollbar-hidden::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
