<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
    <!-- Header decorativo -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 shadow-lg">
      <div class="max-w-6xl mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-2">BeautySalon</h1>
        <p class="text-purple-100">Reserva tu cita online</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-solid mb-4"></div>
        <p class="text-gray-600 text-lg font-medium">Cargando salón...</p>
      </div>

      <!-- Salón no encontrado -->
      <div
        v-else-if="!salon"
        class="bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Salón no encontrado</h2>
        <p class="text-gray-600">El salón que buscas no existe o no está disponible</p>
      </div>

      <!-- Contenido -->
      <div v-else class="space-y-6">
        <!-- Información del salón -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-purple-600">
          <h2 class="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {{ salon.name }}
          </h2>
          <div class="flex flex-wrap gap-4 text-gray-700">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ salon.address }}
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              {{ salon.phone }}
            </div>
          </div>
        </div>

        <!-- Servicios -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center text-gray-800">
            <svg class="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
            </svg>
            Nuestros Servicios
          </h2>
          
          <div v-if="services.length === 0" class="text-center py-10">
            <div class="text-6xl mb-4">💈</div>
            <p class="text-gray-500 text-lg">Este salón aún no tiene servicios disponibles</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <button
              v-for="service in services"
              :key="service.id"
              @click="selectService(service)"
              :class="[
                'group relative p-6 border-2 rounded-2xl transition-all duration-300 text-left',
                selectedService?.id === service.id
                  ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-105'
                  : 'border-purple-200 hover:border-purple-400 hover:shadow-lg bg-gradient-to-br from-white to-purple-50'
              ]"
            >
              <div class="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {{ service.duration }} min
              </div>
              <div v-if="selectedService?.id === service.id" class="absolute top-4 left-4 bg-green-500 text-white rounded-full p-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="font-bold text-xl text-gray-800 mb-2 pr-20">
                {{ service.name }}
              </h3>
              <p class="text-gray-600 mb-4 text-sm">{{ service.description }}</p>
              <p class="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                €{{ service.price }}
              </p>
            </button>
          </div>
        </div>

        <!-- Reserva -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center text-gray-800">
            <svg class="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Reserva tu Cita
          </h2>

          <!-- Mensaje: selecciona servicio primero -->
          <div v-if="!selectedService" class="text-center py-10">
            <div class="text-6xl mb-4">👆</div>
            <p class="text-gray-600 text-lg font-medium">Primero selecciona un servicio arriba</p>
          </div>

          <div v-else>
            <!-- Resumen del servicio seleccionado -->
            <div class="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
              <p class="text-sm text-gray-600 mb-1">Servicio seleccionado:</p>
              <p class="font-bold text-lg text-gray-800">{{ selectedService.name }}</p>
              <p class="text-sm text-gray-600">Duración: {{ selectedService.duration }} min | Precio: €{{ selectedService.price }}</p>
            </div>

            <!-- Selector de fecha rediseñado -->
            <div class="mb-8">
              <label class="block text-lg font-semibold text-gray-700 mb-4">
                📅 Selecciona tu fecha preferida
              </label>
              <div class="relative">
                <input
                  type="date"
                  id="reservation-date"
                  v-model="selectedDate"
                  :min="new Date().toISOString().split('T')[0]"
                  class="w-full p-5 pl-14 border-2 border-purple-300 rounded-2xl shadow-md focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-lg font-semibold transition-all bg-gradient-to-r from-white to-purple-50 cursor-pointer hover:shadow-lg"
                />
                <div class="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Loading slots -->
            <div v-if="loadingSlots" class="text-center py-10">
              <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-solid mx-auto mb-4"></div>
              <p class="text-gray-600">Cargando horarios disponibles...</p>
            </div>

            <!-- Horarios disponibles rediseñados -->
            <div v-else-if="allSlots.length > 0">
              <div class="mb-6 flex items-center justify-between">
                <label class="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Elige tu hora
                </label>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full font-semibold">
                    ✓ {{ displaySlots.length }} libres
                  </span>
                  <span v-if="allSlots.filter(s => s.occupied).length > 0" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    ✗ {{ allSlots.filter(s => s.occupied).length }} ocupadas
                  </span>
                  <span v-if="allSlots.filter(s => s.passed).length > 0" class="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    ⏰ {{ allSlots.filter(s => s.passed).length }} pasadas
                  </span>
                </div>
              </div>
              
              <!-- Mostrar horarios agrupados por turnos -->
              <div 
                v-for="(group, index) in groupSlotsByShifts(allSlots, scheduleData)" 
                :key="index"
                class="mb-6 last:mb-0"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                  <h3 class="text-sm font-bold text-purple-700 uppercase tracking-wide px-3 py-1 bg-purple-50 rounded-full">
                    {{ group.name }}
                  </h3>
                  <div class="h-px flex-1 bg-gradient-to-r from-purple-300 via-transparent to-transparent"></div>
                </div>
                
                <div v-if="group.opening && group.closing" class="text-center mb-3">
                  <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {{ group.opening }} - {{ group.closing }}
                  </span>
                </div>
                
                <div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  <button
                    v-for="slot in group.slots"
                    :key="slot.time"
                    @click="slot.available ? selectSlot(slot.time) : null"
                    :disabled="slot.occupied || slot.passed"
                    :class="[
                      'relative p-4 rounded-xl font-bold text-base transition-all duration-300',
                      slot.time === selectedSlot
                        ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white shadow-2xl scale-110 ring-4 ring-purple-300'
                        : slot.passed
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-50 border-2 border-gray-100 line-through'
                        : slot.occupied
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 border-2 border-gray-200'
                        : 'bg-gradient-to-br from-white to-purple-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 hover:scale-105 shadow-md hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 cursor-pointer',
                    ]"
                  >
                    <span class="relative z-10">{{ slot.time }}</span>
                    <div 
                      v-if="slot.time === selectedSlot"
                      class="absolute top-1 right-1 bg-white rounded-full p-0.5"
                    >
                      <svg class="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div 
                      v-if="slot.passed"
                      class="absolute top-1 right-1 text-gray-300"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div 
                      v-else-if="slot.occupied"
                      class="absolute top-1 right-1 text-gray-400"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              
              <!-- Resumen y formulario de cliente -->
              <div v-if="selectedSlot" class="mt-8 space-y-4">
                <!-- Mensaje de éxito -->
                <div v-if="appointmentSuccess" class="p-6 bg-green-50 border-2 border-green-500 rounded-xl text-center">
                  <div class="text-6xl mb-4">✅</div>
                  <h3 class="text-2xl font-bold text-green-800 mb-2">¡Reserva Confirmada!</h3>
                  <p class="text-green-700 mb-2">Hemos recibido tu reserva correctamente</p>
                  <div class="bg-white rounded-lg p-3 mt-4">
                    <p class="text-sm text-gray-700">
                      📧 Te hemos enviado un email de confirmación con todos los detalles
                    </p>
                    <p class="text-sm text-gray-700 mt-1" v-if="clientPhone">
                      📱 También recibirás un SMS de recordatorio
                    </p>
                  </div>
                </div>

                <!-- Resumen de reserva -->
                <div v-else class="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <h3 class="font-bold text-lg text-gray-800 mb-4">📋 Resumen de tu reserva</h3>
                  <div class="space-y-2 mb-6">
                    <p class="text-gray-700">
                      <span class="font-semibold">Servicio:</span> {{ selectedService.name }}
                    </p>
                    <p class="text-gray-700">
                      <span class="font-semibold">Fecha:</span> {{ new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                    <p class="text-gray-700">
                      <span class="font-semibold">Hora:</span> {{ selectedSlot }} ({{ selectedService.duration }} minutos)
                    </p>
                    <p class="text-gray-700">
                      <span class="font-semibold">Precio:</span> €{{ selectedService.price }}
                    </p>
                  </div>

                  <!-- Formulario de datos del cliente -->
                  <div v-if="!showClientForm">
                    <button
                      @click="openClientForm"
                      class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      ✅ Confirmar Reserva
                    </button>
                  </div>

                  <div v-else class="space-y-4">
                    <h4 class="font-semibold text-gray-800 text-center mb-2">📝 Completa tus datos</h4>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p class="text-xs text-blue-800 text-center">
                        💌 Recibirás un email/SMS de confirmación con los detalles de tu cita
                      </p>
                    </div>
                    
                    <!-- Nombre -->
                    <div class="relative">
                      <input
                        v-model="clientName"
                        type="text"
                        id="client-name"
                        placeholder=" "
                        required
                        class="peer w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all"
                      />
                      <label
                        for="client-name"
                        class="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-purple-600 peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
                      >
                        Nombre completo *
                      </label>
                    </div>

                    <!-- Teléfono -->
                    <div class="relative">
                      <input
                        v-model="clientPhone"
                        type="tel"
                        id="client-phone"
                        placeholder=" "
                        class="peer w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all"
                      />
                      <label
                        for="client-phone"
                        class="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-purple-600 peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
                      >
                        Teléfono (opcional)
                      </label>
                    </div>

                    <!-- Email -->
                    <div class="relative">
                      <input
                        v-model="clientEmail"
                        type="email"
                        id="client-email"
                        placeholder=" "
                        class="peer w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all"
                      />
                      <label
                        for="client-email"
                        class="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-purple-600 peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
                      >
                        Email (opcional)
                      </label>
                    </div>

                    <p class="text-xs text-gray-500 text-center">* Al menos un método de contacto es requerido</p>

                    <!-- Botones -->
                    <div class="flex gap-3">
                      <button
                        @click="cancelClientForm"
                        :disabled="savingAppointment"
                        class="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-400 transition-all disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        @click="confirmAppointment"
                        :disabled="savingAppointment"
                        class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
                      >
                        {{ savingAppointment ? 'Guardando...' : 'Confirmar' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="selectedDate" class="text-center py-10">
              <div class="text-6xl mb-4">😔</div>
              <p class="text-gray-500 text-lg">No hay horarios disponibles para esta fecha</p>
              <p class="text-gray-400 text-sm mt-2">Prueba con otro día</p>
            </div>

            <div v-else class="text-center py-10">
              <div class="text-6xl mb-4">📆</div>
              <p class="text-gray-500 text-lg">Selecciona una fecha para ver los horarios disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const slug = route.params.slug;

const salon = ref(null);
const services = ref([]);
const loading = ref(true);

// Reserva
const selectedService = ref(null);
const selectedDate = ref(null);
const selectedSlot = ref(null);
const displaySlots = ref([]);
const allSlots = ref([]);
const scheduleData = ref(null);
const loadingSlots = ref(false);

// Formulario de cliente
const showClientForm = ref(false);
const clientName = ref('');
const clientPhone = ref('');
const clientEmail = ref('');
const savingAppointment = ref(false);
const appointmentSuccess = ref(false);

function selectService(service) {
  selectedService.value = service;
  selectedDate.value = null;
  selectedSlot.value = null;
  displaySlots.value = [];
  showClientForm.value = false;
  appointmentSuccess.value = false;
}

function selectSlot(slot) {
  selectedSlot.value = slot;
  showClientForm.value = false;
}

function openClientForm() {
  showClientForm.value = true;
}

function cancelClientForm() {
  showClientForm.value = false;
  clientName.value = '';
  clientPhone.value = '';
  clientEmail.value = '';
}

async function confirmAppointment() {
  if (!clientName.value || (!clientPhone.value && !clientEmail.value)) {
    alert('Por favor, completa tu nombre y al menos un método de contacto');
    return;
  }

  savingAppointment.value = true;
  try {
    console.log('📤 Creando cita...');
    const [hour, minute] = selectedSlot.value.split(':');
    const startDateTime = new Date(selectedDate.value);
    startDateTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

    const response = await axios.post(`/public/${slug}/appointments`, {
      clientName: clientName.value,
      clientPhone: clientPhone.value || null,
      clientEmail: clientEmail.value || null,
      serviceId: selectedService.value.id,
      startTime: startDateTime.toISOString(),
    });

    console.log('✅ Cita creada:', response.data);
    appointmentSuccess.value = true;
    
    // Limpiar formulario
    setTimeout(() => {
      selectedService.value = null;
      selectedDate.value = null;
      selectedSlot.value = null;
      displaySlots.value = [];
      showClientForm.value = false;
      clientName.value = '';
      clientPhone.value = '';
      clientEmail.value = '';
      appointmentSuccess.value = false;
    }, 3000);

  } catch (err) {
    console.error('❌ Error creando cita:', err);
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.error || 'Error al crear la cita');
    } else {
      alert('Error al crear la cita');
    }
  } finally {
    savingAppointment.value = false;
  }
}

// Obtener datos del salón y servicios
const fetchSalon = async () => {
  loading.value = true;
  try {
    console.log('📤 Cargando salón público con slug:', slug);
    const { data } = await axios.get(`/public/${slug}`);
    console.log('✅ Datos del salón recibidos:', data);
    salon.value = data.salon || data;
    services.value = data.services || [];
  } catch (err) {
    console.error('❌ Error cargando el salón:', err);
    if (axios.isAxiosError(err)) {
      console.error('❌ Respuesta del servidor:', err.response?.data);
    }
    salon.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSalon();
});

// Función para agrupar slots por turnos (ahora con objetos que tienen estado)
function groupSlotsByShifts(slots, schedules) {
  if (!schedules || schedules.length === 0) return [{ name: 'Horario Disponible', slots }];
  
  const groups = schedules.map((schedule) => {
    const [openHour, openMin] = schedule.opening.split(':').map(Number);
    const [closeHour, closeMin] = schedule.closing.split(':').map(Number);
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    const shiftSlots = slots.filter(slot => {
      const timeStr = slot.time || slot;
      const [hour, min] = timeStr.split(':').map(Number);
      const slotMinutes = hour * 60 + min;
      return slotMinutes >= openMinutes && slotMinutes < closeMinutes;
    });
    
    // Determinar nombre del turno
    let name = '';
    if (schedules.length === 1) {
      name = 'Todo el día';
    } else if (openHour < 14) {
      name = '🌅 Turno Mañana';
    } else {
      name = '🌆 Turno Tarde';
    }
    
    return {
      name,
      opening: schedule.opening,
      closing: schedule.closing,
      slots: shiftSlots,
    };
  }).filter(group => group.slots.length > 0);
  
  return groups;
}

// Cargar slots cuando cambia la fecha (solo si hay servicio seleccionado)
watch(selectedDate, async (newDate) => {
  if (!newDate || !selectedService.value) {
    displaySlots.value = [];
    scheduleData.value = null;
    return;
  }

  loadingSlots.value = true;
  try {
    console.log('📅 Cargando slots para fecha:', newDate, 'y servicio:', selectedService.value.name);
    const { data } = await axios.get(`/public/${slug}/slots`, {
      params: { 
        date: newDate,
        serviceId: selectedService.value.id,
        duration: selectedService.value.duration,
      },
    });
    console.log('✅ Slots cargados:', data);
    displaySlots.value = data.availableSlots || [];
    allSlots.value = data.allSlots || [];
    scheduleData.value = data.schedules || null;
  } catch (err) {
    console.error('❌ Error cargando slots:', err);
    if (axios.isAxiosError(err)) {
      console.error('❌ Respuesta del servidor:', err.response?.data);
    }
    displaySlots.value = [];
    allSlots.value = [];
    scheduleData.value = null;
  } finally {
    loadingSlots.value = false;
  }
});
</script>

<style>
/* Tailwind maneja todos los estilos */
</style>
