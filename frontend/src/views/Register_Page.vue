<template>
  <div class="gradient-bg min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header con animaciones -->
      <div class="text-center mb-8 md:mb-12">
        <div
          class="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-white rounded-full shadow-2xl mb-6 md:mb-8 animate-float"
        >
          <i class="fas fa-cut text-2xl md:text-4xl text-purple-600"></i>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 animate-pulse-slow">
          SalonPro
        </h1>
        <p class="text-purple-100 text-base md:text-xl max-w-2xl mx-auto px-4">
          Transforma tu peluquería con la plataforma de gestión más avanzada
        </p>
      </div>

      <!-- Formulario principal -->
      <div class="glass-effect rounded-3xl shadow-2xl overflow-hidden">
        <form @submit.prevent="handleSubmit" class="space-y-0">
          <!-- Sección 1: Datos Personales -->
          <div class="p-4 sm:p-6 md:p-8 lg:p-12 border-b border-gray-100">
            <div class="flex items-center mb-6 md:mb-10">
              <div
                class="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base md:text-xl mr-3 md:mr-6 shadow-lg flex-shrink-0"
              >
                1
              </div>
              <div>
                <h2 class="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
                  Información Personal
                </h2>
                <p class="text-gray-600 text-sm md:text-lg">
                  Datos del administrador principal
                </p>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-4 md:gap-8">
              <div class="space-y-4 md:space-y-8">
                <!-- Nombre completo -->
                <div class="relative">
                  <div class="relative w-full">
                    <input
                      v-model="form.fullName"
                      @input="handleInput('fullName')"
                      type="text"
                      id="fullName"
                      placeholder=" "
                      class="peer w-full px-3 md:px-4 pt-5 md:pt-6 pb-2 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white caret-transparent"
                    />

                    <label
                      for="fullName"
                      class="absolute left-3 md:left-4 text-gray-500 bg-white px-2 transition-all duration-300 top-1 text-xs md:text-sm text-purple-600 peer-placeholder-shown:top-3 md:peer-placeholder-shown:top-4 peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400"
                    >
                      <i class="fas fa-user mr-1 md:mr-2"></i>Nombre Completo *
                    </label>
                  </div>

                  <div
                    v-if="errors.fullName"
                    class="mt-2 text-red-500 text-sm flex items-center"
                  >
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <span>{{ errors.fullName }}</span>
                  </div>
                </div>

                <!-- Email -->
                <div class="relative">
                  <input
                    v-model="form.email"
                    @input="handleInput('email')"
                    type="email"
                    id="email"
                    placeholder=" "
                    class="peer w-full px-3 md:px-4 pt-5 md:pt-6 pb-2 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white"
                  />
                  <label
                    for="email"
                    class="absolute left-3 md:left-4 text-gray-500 bg-white px-2 transition-all duration-300 top-1 text-xs md:text-sm text-purple-600 peer-placeholder-shown:top-3 md:peer-placeholder-shown:top-4 peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400"
                  >
                    <i class="fas fa-envelope mr-1 md:mr-2"></i>Email *
                  </label>
                  <div
                    v-if="errors.email"
                    class="mt-2 text-red-500 text-sm flex items-center"
                  >
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <span>{{ errors.email }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4 md:space-y-8">
                <!-- Contraseña -->
                <div class="relative">
                  <input
                    v-model="form.password"
                    @input="handleInput('password')"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    placeholder=" "
                    class="peer w-full px-3 md:px-4 pt-5 md:pt-6 pb-2 pr-10 md:pr-12 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white"
                  />
                  <label
                    for="password"
                    class="absolute left-3 md:left-4 text-gray-500 bg-white px-2 transition-all duration-300 top-1 text-xs md:text-sm text-purple-600 peer-placeholder-shown:top-3 md:peer-placeholder-shown:top-4 peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400"
                  >
                    <i class="fas fa-lock mr-1 md:mr-2"></i>Contraseña *
                  </label>
                  <button
                    type="button"
                    @click="togglePassword"
                    class="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                  >
                    <i
                      :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    ></i>
                  </button>
                  <div
                    v-if="errors.password"
                    class="mt-2 text-red-500 text-sm flex items-center"
                  >
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <span>{{ errors.password }}</span>
                  </div>
                </div>

                <!-- Teléfono -->
                <div class="relative">
                  <input
                    v-model="form.phone"
                    type="tel"
                    id="phone"
                    placeholder=" "
                    class="peer w-full px-3 md:px-4 pt-5 md:pt-6 pb-2 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white"
                  />
                  <label
                    for="phone"
                    class="absolute left-3 md:left-4 text-gray-500 bg-white px-2 transition-all duration-300 top-1 text-xs md:text-sm text-purple-600 peer-placeholder-shown:top-3 md:peer-placeholder-shown:top-4 peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400"
                  >
                    <i class="fas fa-phone mr-1 md:mr-2"></i>Teléfono (opcional)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección 2: Datos de la Peluquería -->
          <div
            class="p-4 sm:p-6 md:p-8 lg:p-12 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50"
          >
            <div class="flex items-center mb-6 md:mb-10">
              <div
                class="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-xl mr-3 md:mr-6 shadow-lg flex-shrink-0"
              >
                2
              </div>
              <div>
                <h2 class="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
                  Tu Peluquería
                </h2>
                <p class="text-gray-600 text-sm md:text-lg">
                  Información del establecimiento
                </p>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-4 md:gap-8">
              <div class="lg:col-span-2">
                <div class="relative">
                  <input
                    v-model="form.salonName"
                    @input="handleInput('salonName')"
                    type="text"
                    id="salonName"
                    placeholder=" "
                    class="peer w-full px-3 md:px-4 pt-5 md:pt-6 pb-2 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-white"
                  />
                  <label
                    for="salonName"
                    class="absolute left-3 md:left-4 text-gray-500 bg-white px-2 transition-all duration-300 top-1 text-xs md:text-sm text-pink-600 peer-placeholder-shown:top-3 md:peer-placeholder-shown:top-4 peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400"
                  >
                    <i class="fas fa-store mr-1 md:mr-2"></i>Nombre de la Peluquería *
                  </label>
                  <div
                    v-if="errors.salonName"
                    class="mt-2 text-red-500 text-sm flex items-center"
                  >
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <span>{{ errors.salonName }}</span>
                  </div>
                </div>
              </div>

              <div class="relative">
                <input
                  v-model="form.salonAddress"
                  type="text"
                  id="salonAddress"
                  placeholder=" "
                  class="peer w-full px-3 md:px-4 pt-5 md:pt-6 pb-2 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-white"
                />
                <label
                  for="salonAddress"
                  class="absolute left-3 md:left-4 text-gray-500 bg-white px-2 transition-all duration-300 top-1 text-xs md:text-sm text-pink-600 peer-placeholder-shown:top-3 md:peer-placeholder-shown:top-4 peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400"
                >
                  <i class="fas fa-map-marker-alt mr-1 md:mr-2"></i>Dirección (opcional)
                </label>
              </div>

              <div class="relative">
                <input
                  v-model="form.salonPhone"
                  type="tel"
                  id="salonPhone"
                  placeholder=" "
                  class="peer w-full px-3 md:px-4 pt-5 md:pt-6 pb-2 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-white"
                />
                <label
                  for="salonPhone"
                  class="absolute left-3 md:left-4 text-gray-500 bg-white px-2 transition-all duration-300 top-1 text-xs md:text-sm text-pink-600 peer-placeholder-shown:top-3 md:peer-placeholder-shown:top-4 peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400"
                >
                  <i class="fas fa-phone-alt mr-1 md:mr-2"></i>Teléfono del Salón
                  (opcional)
                </label>
              </div>
            </div>
          </div>

          <!-- Sección 3: Configuración -->
          <div class="p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div class="flex items-center mb-6 md:mb-10">
              <div
                class="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-xl mr-3 md:mr-6 shadow-lg flex-shrink-0"
              >
                3
              </div>
              <div>
                <h2 class="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
                  Configuración Inicial
                </h2>
                <p class="text-gray-600 text-sm md:text-lg">
                  Personaliza el funcionamiento de tu salón
                </p>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 md:gap-6">
              <div
                v-for="option in checkboxOptions"
                :key="option.id"
                class="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 md:hover:-translate-y-1"
              >
                <label class="flex items-start space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="form[option.id]"
                    class="custom-checkbox mt-1"
                  />
                  <div class="flex-1">
                    <div
                      class="font-semibold text-gray-800 text-base md:text-lg mb-2 flex items-center"
                    >
                      <i
                        :class="option.icon + ' mr-2'"
                        :style="{ color: option.color }"
                      ></i>
                      {{ option.label }}
                    </div>
                    <p class="text-gray-600 text-sm md:text-base">{{ option.description }}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Resumen de configuración -->
            <div
              v-if="selectedOptions.length"
              class="mt-6 md:mt-8 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-green-500"
            >
              <h3
                class="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center"
              >
                <i class="fas fa-clipboard-check text-green-500 mr-2"></i>
                Configuración Seleccionada ({{ selectedOptions.length }} de
                {{ checkboxOptions.length }})
              </h3>
              <div class="flex flex-wrap gap-3">
                <span
                  v-for="opt in selectedOptions"
                  :key="opt.id"
                  class="px-4 py-2 rounded-full text-sm font-medium flex items-center"
                  :style="{
                    backgroundColor: opt.bgColor,
                    color: opt.textColor,
                  }"
                >
                  <i :class="opt.icon + ' mr-2'"></i>{{ opt.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Botón de envío -->
          <div class="p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50 text-center">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full md:w-auto inline-flex items-center justify-center px-6 md:px-12 py-4 md:py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white font-bold text-base md:text-xl rounded-xl md:rounded-2xl shadow-2xl hover:shadow-3xl transform md:hover:-translate-y-2 md:hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <i
                :class="
                  isSubmitting
                    ? 'fas fa-spinner fa-spin mr-2 md:mr-3 text-base md:text-xl'
                    : 'fas fa-rocket mr-2 md:mr-3 text-base md:text-xl'
                "
              ></i>
              {{
                isSubmitting
                  ? 'Configurando tu salón...'
                  : 'Crear Mi Cuenta Profesional'
              }}
            </button>

            <div class="mt-6 md:mt-8 space-y-3 md:space-y-4">
              <p class="text-gray-600 text-base md:text-lg">
                ¿Ya tienes una cuenta?
                <a
                  href="#"
                  class="text-purple-600 hover:text-purple-800 font-semibold underline transition-colors duration-200"
                  >Inicia sesión aquí</a
                >
              </p>

              <div
                class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:space-x-6 text-xs md:text-sm text-gray-500"
              >
                <span class="flex items-center">
                  <i class="fas fa-shield-alt text-green-500 mr-2"></i>Datos
                  seguros
                </span>
                <span class="flex items-center">
                  <i class="fas fa-clock text-blue-500 mr-2"></i>Setup en 2
                  minutos
                </span>
                <span class="flex items-center">
                  <i class="fas fa-star text-yellow-500 mr-2"></i>Soporte 24/7
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  phone: '',
  salonName: '',
  salonAddress: '',
  salonPhone: '',
  requireConfirmation: false,
  allowEmployeeServices: false,
  acceptBookings: true,
  allowModifyBookings: false,
});

const errors = reactive({});
const showPassword = ref(false);
const isSubmitting = ref(false);

const checkboxOptions = [
  {
    id: 'requireConfirmation',
    label: 'Confirmación Obligatoria',
    description:
      'Las reservas necesitarán tu aprobación antes de confirmarse automáticamente',
    icon: 'fas fa-check-circle',
    color: '#10B981',
    bgColor: '#D1FAE5',
    textColor: '#065F46',
  },
  {
    id: 'allowEmployeeServices',
    label: 'Empleados Crean Servicios',
    description: 'Permite que tu equipo añada nuevos servicios y tratamientos',
    icon: 'fas fa-users',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    textColor: '#1E3A8A',
  },
  {
    id: 'acceptBookings',
    label: 'Aceptar Reservas',
    description: 'Los clientes podrán hacer reservas online directamente',
    icon: 'fas fa-calendar-plus',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    textColor: '#5B21B6',
  },
  {
    id: 'allowModifyBookings',
    label: 'Modificar Reservas',
    description:
      'Permite cambios en fecha, hora o servicios de reservas existentes',
    icon: 'fas fa-edit',
    color: '#F97316',
    bgColor: '#FFEDD5',
    textColor: '#C2410C',
  },
];

const selectedOptions = computed(() =>
  checkboxOptions.filter((opt) => form[opt.id])
);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function handleInput(field) {
  const value = form[field];
  switch (field) {
    case 'fullName':
      errors.fullName = value ? '' : 'El nombre completo es obligatorio';
      break;
    case 'email':
      if (!value) errors.email = 'El email es obligatorio';
      else if (!/\S+@\S+\.\S+/.test(value))
        errors.email = 'Formato de email inválido';
      else errors.email = '';
      break;
    case 'password':
      if (!value) errors.password = 'La contraseña es obligatoria';
      else if (value.length < 8) errors.password = 'Mínimo 8 caracteres';
      else errors.password = '';
      break;
    case 'salonName':
      errors.salonName = value
        ? ''
        : 'El nombre de la peluquería es obligatorio';
      break;
  }
}

async function handleSubmit() {
  // Validaciones
  ['fullName', 'email', 'password', 'salonName'].forEach((f) => handleInput(f));
  if (Object.values(errors).some((e) => e)) return;

  isSubmitting.value = true;
  try {
    // Preparar datos para enviar al backend
    const payload = {
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      phone: form.phone || null,
      salonName: form.salonName,
      salonAddress: form.salonAddress || null,
      salonPhone: form.salonPhone || null,
      config: {
        requireConfirmation: form.requireConfirmation,
        workersCanCreateServices: form.allowEmployeeServices,
        canAcceptAppointments: form.acceptBookings,
        canModifyAppointments: form.allowModifyBookings,
      },
    };

    console.log('📤 Enviando datos al backend:', payload);

    const { data } = await axios.post('/auth/register', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('✅ Respuesta del backend:', data);

    // Preparar datos del usuario con el slug del salón
    const userData = {
      ...data.user,
      salonSlug: data.user.salon?.slug || null,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));

    alert('✅ ¡Cuenta creada con éxito!');
    router.push('/dashboard');
  } catch (err) {
    console.error('❌ Error completo:', err);
    if (axios.isAxiosError(err)) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Error en el registro';
      console.error('❌ Error del servidor:', err.response?.data);
      alert(`❌ ${errorMessage}`);
    } else {
      alert('❌ Error en el registro: ' + err.message);
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
* {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

input,
textarea {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.caret-transparent {
  caret-color: transparent;
}
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}
.glass-effect {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
}
.floating-label {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.floating-input:focus + .floating-label,
.floating-input.has-value + .floating-label {
  transform: translateY(-1.5rem) scale(0.85);
  color: #8b5cf6;
  font-weight: 600;
}
.custom-checkbox {
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}
.custom-checkbox:checked {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border-color: #8b5cf6;
}
.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.45rem;
  height: 0.75rem;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: translate(-50%, -60%) rotate(45deg);
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-pulse-slow {
  animation: pulse 3s infinite;
}
</style>
