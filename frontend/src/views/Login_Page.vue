<template>
  <div class="min-h-screen flex">
    <!-- Panel izquierdo - Decorativo -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
      <!-- Círculos decorativos -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <!-- Contenido -->
      <div class="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
        <div class="max-w-md">
          <div class="mb-8">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
          </div>
          
          <h1 class="text-5xl font-bold mb-6">
            Bienvenido de vuelta
          </h1>
          <p class="text-xl text-white/90 leading-relaxed">
            Gestiona tu salón de belleza de forma profesional. Organiza citas, controla tu inventario y ofrece la mejor experiencia a tus clientes.
          </p>
          
          <div class="mt-12 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span class="text-2xl">📅</span>
              </div>
              <span class="text-lg">Gestión de citas inteligente</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span class="text-2xl">👥</span>
              </div>
              <span class="text-lg">Control completo de clientes</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span class="text-2xl">📊</span>
              </div>
              <span class="text-lg">Estadísticas en tiempo real</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel derecho - Formulario -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
      <div class="w-full max-w-md">
        <!-- Logo móvil -->
        <div class="lg:hidden mb-8 text-center">
          <div class="inline-flex w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl items-center justify-center mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
        </div>

        <!-- Encabezado -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Iniciar Sesión
          </h2>
          <p class="text-gray-600">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <span class="text-red-500 text-xl">⚠️</span>
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input
                v-model="email"
                type="email"
                id="email"
                class="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                v-model="password"
                type="password"
                id="password"
                class="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <!-- Olvidé mi contraseña -->
          <div class="flex items-center justify-end">
            <button
              type="button"
              @click="showForgotPassword = true"
              class="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <!-- Botón de login -->
          <button
            type="submit"
            class="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <!-- Separador -->
        <div class="mt-8 mb-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-gray-50 text-gray-500">¿No tienes cuenta?</span>
            </div>
          </div>
        </div>

        <!-- Enlace registro -->
        <router-link
          to="/register"
          class="block w-full py-3.5 px-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-purple-600 hover:text-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-center"
        >
          Crear cuenta nueva
        </router-link>
      </div>
    </div>

    <!-- Modal Olvidé mi contraseña -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-scale-in">
        <!-- Header del modal -->
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-1">Restablecer Contraseña</h3>
            <p class="text-sm text-gray-500">Te enviaremos un enlace de recuperación</p>
          </div>
          <button 
            @click="closeForgotPassword" 
            class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="resetSuccess" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-slide-down">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p class="text-green-800 font-medium text-sm">¡Enlace enviado!</p>
            <p class="text-green-700 text-sm mt-1">Revisa tu correo electrónico para restablecer tu contraseña.</p>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="resetError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-slide-down">
          <span class="text-red-500 text-xl">⚠️</span>
          <p class="text-red-700 text-sm">{{ resetError }}</p>
        </div>

        <!-- Formulario -->
        <form v-if="!resetSuccess" @submit.prevent="handleForgotPassword" class="space-y-5">
          <div>
            <label for="reset-email" class="block text-sm font-semibold text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input
                v-model="resetEmail"
                type="email"
                id="reset-email"
                class="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            :disabled="resetLoading"
          >
            <span v-if="resetLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
            <span v-else>Enviar enlace de recuperación</span>
          </button>
        </form>

        <!-- Botón cerrar cuando hay éxito -->
        <button
          v-if="resetSuccess"
          @click="closeForgotPassword"
          class="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
</style>

<script setup>
import { ref } from 'vue';
import axios from '@/utils/axios';
import { useRouter } from 'vue-router';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Restablecer contraseña
const showForgotPassword = ref(false);
const resetEmail = ref('');
const resetLoading = ref(false);
const resetSuccess = ref(false);
const resetError = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    console.log('📤 Intentando login con:', { email: email.value });

    const res = await axios.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    console.log('✅ Login exitoso:', res.data);

    // Preparar datos del usuario con el slug y nombre del salón
    const userData = {
      ...res.data.user,
      salonSlug: res.data.user.salon?.slug || null,
      salonName: res.data.user.salon?.name || null,
    };

    // Guardar token y usuario en localStorage
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(userData));

    // Redirigir al dashboard
    router.push('/dashboard');
  } catch (err) {
    console.error('❌ Error en login:', err);
    // Manejo de errores con axios
    if (err.response) {
      error.value = err.response?.data?.error || 'Error en el login';
      console.error('❌ Error del servidor:', err.response?.data);
    } else {
      error.value = 'Error de conexión con el servidor';
    }
  } finally {
    loading.value = false;
  }
};

// Manejar solicitud de restablecimiento
const handleForgotPassword = async () => {
  resetLoading.value = true;
  resetSuccess.value = false;
  resetError.value = '';
  
  try {
    await axios.post(`${API_URL}/auth/forgot-password`, {
      email: resetEmail.value
    });
    
    resetSuccess.value = true;
    setTimeout(() => {
      closeForgotPassword();
    }, 3000);
  } catch (err) {
    if (err.response) {
      resetError.value = err.response?.data?.error || 'Error al enviar el correo';
    } else {
      resetError.value = 'Error al enviar el correo';
    }
  } finally {
    resetLoading.value = false;
  }
};

// Cerrar modal
const closeForgotPassword = () => {
  showForgotPassword.value = false;
  resetEmail.value = '';
  resetSuccess.value = false;
  resetError.value = '';
};
</script>
