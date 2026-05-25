<template>
  <div class="min-h-screen flex">
    <!-- Panel izquierdo - Decorativo -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
      <!-- Círculos decorativos -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <!-- Contenido -->
      <div class="relative z-10 flex flex-col justify-center text-white px-10 py-10 xl:px-14 w-full">
        <div class="max-w-md">
          <router-link to="/" class="inline-block mb-5 transition-opacity hover:opacity-90" aria-label="TimeIt — inicio">
            <BrandLogo variant="fullWhite" size="md" />
          </router-link>
          <h1 class="text-3xl xl:text-4xl font-bold mb-5">
            Bienvenido de vuelta
          </h1>
          <p class="text-xl text-white/90 leading-relaxed">
            Gestiona tu salón de belleza de forma profesional. Organiza citas, tu equipo y tus clientes desde un solo lugar.
          </p>
          
          <div class="mt-12 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <span class="text-lg">Gestión de citas inteligente</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <span class="text-lg">Control completo de clientes</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
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
        <router-link to="/" class="inline-block mb-6 lg:hidden transition-opacity hover:opacity-90" aria-label="TimeIt — inicio">
          <BrandLogo variant="fullOnLight" size="md" />
        </router-link>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
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
import { forgotPasswordRequest, loginRequest } from '@/domains/auth/api/authApi';
import { useRouter } from 'vue-router';
import BrandLogo from '@/components/BrandLogo.vue';

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

    const res = await loginRequest({
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
    await forgotPasswordRequest(resetEmail.value);
    
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
