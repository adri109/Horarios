<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Panel izquierdo -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 relative overflow-hidden"
    >
      <div class="absolute top-24 left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div class="absolute bottom-24 right-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

      <div class="relative z-10 flex flex-col justify-center text-white px-12 py-16 xl:px-16 w-full">
        <p class="text-sm font-medium uppercase tracking-wider text-white/75 mb-3">
          {{ BRAND.appName }}
        </p>
        <h1 class="text-4xl xl:text-[2.65rem] font-bold leading-tight mb-6">
          Crea tu cuenta y gestiona tu {{ BRAND.categoryLabel.toLowerCase() }}
        </h1>
        <p class="text-lg text-white/85 leading-relaxed max-w-md">
          Dos pasos: tu acceso al panel y los datos básicos del negocio.
        </p>

        <ul class="mt-12 space-y-4 max-w-md">
          <li class="flex gap-4 items-start">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/25">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
            <div>
              <p class="font-semibold">Cuenta de administrador</p>
              <p class="text-sm text-white/75 mt-0.5">
                El mismo tipo de credenciales que usarás cada día para entrar al panel.
              </p>
            </div>
          </li>
          <li class="flex gap-4 items-start">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/25">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2M3.571 9.687l6.25-3.743M14 3.687l6.25 3.743M21 21v-9.937a2.25 2.25 0 00-1.007-1.874l-6.25-3.743a2.25 2.25 0 00-2.236 0L5.757 10.188A2.25 2.25 0 004.75 12.063V21" />
              </svg>
            </span>
            <div>
              <p class="font-semibold">Tu negocio en el panel</p>
              <p class="text-sm text-white/75 mt-0.5">
                Horarios, servicios y página pública los configuras después con calma.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Panel derecho (mismo ritmo visual que Login) -->
    <div class="flex-1 w-full lg:w-1/2 flex flex-col bg-gray-50">
      <div class="lg:hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-6 shrink-0">
        <h1 class="text-2xl font-bold">{{ BRAND.appName }}</h1>
        <p class="text-white/85 text-sm mt-1">Registro en dos pasos</p>
      </div>

      <div class="flex-1 flex items-start lg:items-center justify-center px-6 py-8 lg:py-12 overflow-y-auto">
        <div class="w-full max-w-md mx-auto">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div class="mb-6">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">
                Crear cuenta
              </h2>
              <p class="text-gray-600 mt-2 text-sm sm:text-base">
                {{ stepTitles[currentStep].subtitle }}
              </p>
            </div>

            <div class="flex items-center gap-2 mb-6" aria-label="Progreso del registro">
              <template v-for="(s, idx) in steps" :key="s.id">
                <button
                  type="button"
                  class="flex-1 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg"
                  :disabled="idx > currentStep"
                  @click="goToStep(idx)"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200"
                      :class="stepBadgeClass(idx)"
                    >
                      {{ idx < currentStep ? '✓' : idx + 1 }}
                    </span>
                    <div class="min-w-0">
                      <p
                        class="text-xs font-semibold uppercase tracking-wide truncate"
                        :class="idx === currentStep ? 'text-purple-700' : idx < currentStep ? 'text-green-700' : 'text-gray-400'"
                      >
                        {{ s.short }}
                      </p>
                      <p class="text-[11px] text-gray-500 truncate">{{ s.hint }}</p>
                    </div>
                  </div>
                </button>
                <div
                  v-if="idx < steps.length - 1"
                  class="h-0.5 flex-1 max-w-[2rem] sm:max-w-[3rem] rounded-full transition-colors duration-300"
                  :class="idx < currentStep ? 'bg-green-400' : 'bg-gray-200'"
                  aria-hidden="true"
                />
              </template>
            </div>

            <form @submit.prevent="onFormSubmit">
              <div v-show="currentStep === 0" class="space-y-5">
                <div>
                  <label
                    for="fullName"
                    class="block text-sm font-semibold text-gray-700"
                    :class="accountStepValidated && errors.fullName ? 'mb-1' : 'mb-2'"
                  >
                    Nombre completo
                  </label>
                  <p
                    v-if="accountStepValidated && errors.fullName"
                    id="register-error-fullName"
                    class="mb-2 text-[11px] leading-snug text-red-600"
                    role="alert"
                  >
                    {{ errors.fullName }}
                  </p>
                  <input
                    id="fullName"
                    v-model="form.fullName"
                    type="text"
                    autocomplete="name"
                    :class="['register-input', inputInvalidAccount('fullName')]"
                    placeholder="Ej. María García"
                    :aria-invalid="accountStepValidated && !!errors.fullName"
                    :aria-errormessage="
                      accountStepValidated && errors.fullName ? 'register-error-fullName' : undefined
                    "
                    @input="onAccountInput('fullName')"
                    @blur="handleInput('fullName')"
                  />
                </div>

                <div>
                  <label
                    for="email"
                    class="block text-sm font-semibold text-gray-700"
                    :class="emailFieldHintMarginClass"
                  >
                    Email
                  </label>
                  <p
                    v-if="emailFieldMessage"
                    id="register-error-email"
                    class="mb-2 text-[11px] leading-snug text-red-600"
                    role="alert"
                  >
                    {{ emailFieldMessage }}
                  </p>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      autocomplete="email"
                      :class="['register-input register-input-pl', emailInputInvalidClass]"
                      placeholder="tu@email.com"
                      :aria-invalid="emailFieldInvalid"
                      :aria-errormessage="emailFieldMessage ? 'register-error-email' : undefined"
                      @input="onAccountInput('email')"
                      @blur="handleInput('email')"
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="password"
                    class="block text-sm font-semibold text-gray-700"
                    :class="accountStepValidated && errors.password ? 'mb-1' : 'mb-2'"
                  >
                    Contraseña
                  </label>
                  <p
                    v-if="accountStepValidated && errors.password"
                    id="register-error-password"
                    class="mb-2 text-[11px] leading-snug text-red-600"
                    role="alert"
                  >
                    {{ errors.password }}
                  </p>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      :class="['register-input register-input-pl pr-11', inputInvalidAccount('password')]"
                      placeholder="Mínimo 8 caracteres"
                      :aria-invalid="accountStepValidated && !!errors.password"
                      :aria-errormessage="
                        accountStepValidated && errors.password ? 'register-error-password' : undefined
                      "
                      @input="onAccountInput('password')"
                      @blur="handleInput('password')"
                    />
                    <button
                      type="button"
                      tabindex="-1"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      aria-label="Mostrar u ocultar contraseña"
                      @click="togglePassword"
                    >
                      <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    </button>
                  </div>
                  <p class="mt-1.5 text-xs text-gray-500">Mínimo 8 caracteres.</p>
                </div>

                <div>
                  <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono <span class="font-normal text-gray-400">(opcional)</span>
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    autocomplete="tel"
                    class="register-input"
                    placeholder="+34 ..."
                  />
                </div>

                <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                  <RouterLink to="/login" class="btn-ghost text-center sm:text-left">
                    ¿Ya tienes cuenta? Iniciar sesión
                  </RouterLink>
                  <button
                    type="button"
                    class="btn-primary"
                    :disabled="isCheckingEmail"
                    @click="goNext"
                  >
                    <svg
                      v-if="isCheckingEmail"
                      class="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span v-if="!isCheckingEmail">Siguiente</span>
                    <span v-else>Comprobando…</span>
                    <svg
                      v-if="!isCheckingEmail"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-show="currentStep === 1" class="space-y-5">
                <div>
                  <label
                    for="salonName"
                    class="block text-sm font-semibold text-gray-700"
                    :class="(salonStepValidated && errors.salonName) || submitError ? 'mb-1' : 'mb-2'"
                  >
                    Nombre del salón
                  </label>
                  <p
                    v-if="salonStepValidated && errors.salonName"
                    id="register-error-salonName"
                    class="mb-2 text-[11px] leading-snug text-red-600"
                    role="alert"
                  >
                    {{ errors.salonName }}
                  </p>
                  <p
                    v-else-if="submitError"
                    id="register-error-submit-step2"
                    class="mb-2 text-[11px] leading-snug text-red-600"
                    role="alert"
                  >
                    {{ submitError }}
                  </p>
                  <input
                    id="salonName"
                    v-model="form.salonName"
                    type="text"
                    autocomplete="organization"
                    :class="['register-input', inputInvalidSalon()]"
                    placeholder="Ej. Estudio Luna"
                    :aria-invalid="salonStepValidated && !!errors.salonName"
                    :aria-errormessage="
                      salonStepValidated && errors.salonName ? 'register-error-salonName' : undefined
                    "
                    @input="onSalonNameInput"
                    @blur="handleInput('salonName')"
                  />
                </div>

                <div>
                  <label for="salonAddress" class="block text-sm font-semibold text-gray-700 mb-2">
                    Dirección <span class="font-normal text-gray-400">(opcional)</span>
                  </label>
                  <textarea
                    id="salonAddress"
                    v-model="form.salonAddress"
                    rows="2"
                    class="register-input resize-y min-h-[3rem]"
                    placeholder="Calle, número, ciudad…"
                  />
                </div>

                <div>
                  <label for="salonPhone" class="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono del salón <span class="font-normal text-gray-400">(opcional)</span>
                  </label>
                  <input
                    id="salonPhone"
                    v-model="form.salonPhone"
                    type="tel"
                    autocomplete="tel"
                    class="register-input"
                    placeholder="+34 ..."
                  />
                </div>

                <div class="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <p class="text-sm text-gray-600">
                    <span class="font-medium text-gray-800">Después podrás</span>
                    ajustar horarios, servicios y la página pública desde el panel.
                  </p>
                </div>

                <div class="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
                  <button type="button" class="btn-secondary" @click="goPrev">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Anterior
                  </button>
                  <button
                    type="submit"
                    class="btn-primary justify-center disabled:opacity-50 disabled:pointer-events-none"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="flex items-center gap-2 justify-center">
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creando cuenta…
                    </span>
                    <span v-else class="flex items-center gap-2 justify-center">
                      Crear cuenta
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <p class="mt-6 text-center text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
            Al crear una cuenta aceptas un uso profesional conforme a la normativa aplicable para tu negocio.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { registerRequest, checkRegistrationEmailRequest } from '@/domains/auth/api/authApi';
import { BRAND } from '@/config/branding';

const router = useRouter();

const steps = [
  { id: 'account', short: 'Tu cuenta', hint: 'Acceso al panel' },
  { id: 'salon', short: 'Tu salón', hint: 'Datos del negocio' },
];

const stepTitles = [
  {
    subtitle: 'Configura tus datos de acceso para administrar tu salón.',
  },
  {
    subtitle: 'Identifica tu negocio; podrás ampliar detalles luego desde configuración.',
  },
];

const currentStep = ref(0);

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  phone: '',
  salonName: '',
  salonAddress: '',
  salonPhone: '',
});

const errors = reactive({
  fullName: '',
  email: '',
  password: '',
  salonName: '',
});

const showPassword = ref(false);
const isSubmitting = ref(false);
const isCheckingEmail = ref(false);
const submitError = ref('');

const accountStepValidated = ref(false);
const salonStepValidated = ref(false);

/** Texto bajo la etiqueta Email: validación local o error al comprobar/registrar. */
const emailFieldMessage = computed(() => {
  if (currentStep.value !== 0) return '';
  if (accountStepValidated.value && errors.email) return errors.email;
  if (submitError.value) return submitError.value;
  return '';
});

const emailFieldInvalid = computed(() => {
  if (currentStep.value !== 0) return false;
  return (accountStepValidated.value && !!errors.email) || !!submitError.value;
});

const emailFieldHintMarginClass = computed(() =>
  emailFieldMessage.value ? 'mb-1' : 'mb-2'
);

const emailInputInvalidClass = computed(() => {
  if (currentStep.value !== 0) return '';
  if (accountStepValidated.value && errors.email) return 'register-input-invalid';
  if (submitError.value) return 'register-input-invalid';
  return '';
});

function inputInvalidAccount(field) {
  return accountStepValidated.value && errors[field] ? 'register-input-invalid' : '';
}

function inputInvalidSalon() {
  return salonStepValidated.value && errors.salonName ? 'register-input-invalid' : '';
}

function onAccountInput(field) {
  if (field === 'email') submitError.value = '';
  handleInput(field);
}

function onSalonNameInput() {
  submitError.value = '';
  handleInput('salonName');
}

function stepBadgeClass(idx) {
  if (idx < currentStep.value) return 'bg-green-600 text-white ring-2 ring-green-600/25';
  if (idx === currentStep.value) return 'bg-purple-600 text-white ring-2 ring-purple-600/25';
  return 'bg-gray-100 text-gray-400 ring-2 ring-transparent';
}

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function handleInput(field) {
  const value = form[field];
  switch (field) {
    case 'fullName':
      errors.fullName = value?.trim() ? '' : 'El nombre completo es obligatorio';
      break;
    case 'email':
      if (!value?.trim()) errors.email = 'El email es obligatorio';
      else if (!/\S+@\S+\.\S+/.test(value)) errors.email = 'Formato de email inválido';
      else errors.email = '';
      break;
    case 'password':
      if (!value) errors.password = 'La contraseña es obligatoria';
      else if (value.length < 8) errors.password = 'Mínimo 8 caracteres';
      else errors.password = '';
      break;
    case 'salonName':
      errors.salonName = value?.trim() ? '' : 'El nombre del salón es obligatorio';
      break;
    default:
      break;
  }
}

function validateAccountStep() {
  ['fullName', 'email', 'password'].forEach((f) => handleInput(f));
  return !errors.fullName && !errors.email && !errors.password;
}

function validateSalonStep() {
  handleInput('salonName');
  return !errors.salonName;
}

async function goNext() {
  submitError.value = '';
  if (!validateAccountStep()) {
    accountStepValidated.value = true;
    return;
  }
  accountStepValidated.value = false;

  isCheckingEmail.value = true;
  try {
    const { data } = await checkRegistrationEmailRequest({
      email: form.email.trim(),
    });
    if (!data.available) {
      submitError.value = data.error || 'El email ya está registrado';
      return;
    }
    currentStep.value = 1;
  } catch (err) {
    const msg =
      err.response?.data?.error ??
      err.response?.data?.message ??
      (typeof err.response?.data === 'string' ? err.response.data : null);
    submitError.value =
      msg ||
      'No se ha podido comprobar el email. Revisa tu conexión e inténtalo de nuevo.';
  } finally {
    isCheckingEmail.value = false;
  }
}

function goPrev() {
  submitError.value = '';
  accountStepValidated.value = false;
  salonStepValidated.value = false;
  currentStep.value = 0;
}

function goToStep(idx) {
  if (idx >= currentStep.value) return;
  currentStep.value = idx;
  submitError.value = '';
  accountStepValidated.value = false;
  salonStepValidated.value = false;
}

function onFormSubmit() {
  if (currentStep.value === 0) {
    void goNext();
    return;
  }
  handleSubmit();
}

async function handleSubmit() {
  if (!validateSalonStep()) {
    salonStepValidated.value = true;
    return;
  }
  salonStepValidated.value = false;

  isSubmitting.value = true;
  submitError.value = '';
  try {
    const payload = {
      email: form.email,
      password: form.password,
      fullName: form.fullName.trim(),
      phone: form.phone?.trim() || null,
      salonName: form.salonName.trim(),
      salonAddress: form.salonAddress?.trim() || null,
      salonPhone: form.salonPhone?.trim() || null,
    };

    const { data } = await registerRequest(payload);

    const userData = {
      ...data.user,
      salonSlug: data.user.salon?.slug || null,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));

    router.push('/dashboard');
  } catch (err) {
    const apiMsg =
      err.response?.data?.error ??
      err.response?.data?.message ??
      (typeof err.response?.data === 'string' ? err.response.data : null);
    submitError.value = apiMsg || err.message || 'No se pudo completar el registro. Inténtalo de nuevo.';
    if (submitError.value.toLowerCase().includes('email') || submitError.value.includes('registrado')) {
      currentStep.value = 0;
      salonStepValidated.value = false;
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex min-h-[2.75rem] items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold shadow-sm hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto;
}

.btn-secondary {
  @apply inline-flex min-h-[2.75rem] items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-colors duration-150 w-full sm:w-auto;
}

.btn-ghost {
  @apply inline-flex items-center justify-center text-sm font-semibold text-purple-600 hover:text-purple-800 py-2 transition-colors duration-150;
}

.register-input {
  @apply w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none transition-shadow duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500;
}

.register-input-pl {
  @apply pl-11;
}

.register-input-invalid {
  @apply border-red-500 ring-2 ring-red-500/30 focus:border-red-500 focus:ring-red-500/40;
}
</style>
