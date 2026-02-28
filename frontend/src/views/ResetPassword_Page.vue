<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <!-- Logo / Título -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-purple-600 mb-2">
          Restablecer Contraseña
        </h1>
        <p class="text-gray-600">
          Introduce tu nueva contraseña
        </p>
      </div>

      <!-- Estado de carga del token -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Validando token...</p>
      </div>

      <!-- Token inválido -->
      <div v-else-if="tokenError" class="text-center py-8">
        <div class="text-red-500 text-5xl mb-4">✕</div>
        <p class="text-red-600 font-medium mb-4">{{ tokenError }}</p>
        <router-link
          to="/login"
          class="inline-block px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          Volver al inicio de sesión
        </router-link>
      </div>

      <!-- Formulario de restablecimiento -->
      <form v-else @submit.prevent="handleResetPassword" class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Nueva Contraseña
          </label>
          <input
            v-model="newPassword"
            type="password"
            id="password"
            class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            placeholder="••••••••"
            required
            minlength="6"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Contraseña
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            placeholder="••••••••"
            required
            minlength="6"
          />
        </div>

        <!-- Mensaje de error -->
        <p v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </p>

        <!-- Mensaje de éxito -->
        <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-4 text-center">
          <p class="text-green-600 font-medium mb-3">
            ✓ Contraseña actualizada exitosamente
          </p>
          <router-link
            to="/login"
            class="inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Ir al inicio de sesión
          </router-link>
        </div>

        <!-- Botón submit -->
        <button
          v-if="!success"
          type="submit"
          class="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
          :disabled="resetLoading"
        >
          {{ resetLoading ? 'Actualizando...' : 'Actualizar Contraseña' }}
        </button>
      </form>

      <!-- Link volver a login -->
      <div v-if="!success && !tokenError" class="mt-6 text-center">
        <router-link
          to="/login"
          class="text-sm text-purple-600 hover:underline"
        >
          Volver al inicio de sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { resetPasswordRequest } from '@/domains/auth/api/authApi';
import { useRoute } from 'vue-router';
const route = useRoute();

const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(true);
const tokenError = ref('');
const error = ref('');
const success = ref(false);
const resetLoading = ref(false);

// Validar token al cargar la página
onMounted(() => {
  token.value = String(route.query.token || '');
  
  if (!token.value) {
    tokenError.value = 'Token de restablecimiento no encontrado';
    loading.value = false;
  } else {
    // Token existe, permitir continuar
    loading.value = false;
  }
});

// Manejar restablecimiento de contraseña
const handleResetPassword = async () => {
  error.value = '';
  
  // Validar que las contraseñas coincidan
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  // Validar longitud mínima
  if (newPassword.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  resetLoading.value = true;

  try {
    await resetPasswordRequest(token.value, newPassword.value);

    success.value = true;
  } catch (err) {
    if (err.response) {
      error.value = err.response?.data?.error || 'Error al restablecer la contraseña';
    } else {
      error.value = 'Error al restablecer la contraseña';
    }
  } finally {
    resetLoading.value = false;
  }
};
</script>

<style scoped>
/* Animación de spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
