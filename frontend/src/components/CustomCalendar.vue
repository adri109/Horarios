<template>
  <div class="relative">
    <!-- Botón para abrir calendario -->
    <button
      @click="toggleCalendar"
      type="button"
      class="w-full p-4 pl-14 pr-4 border-2 rounded-xl shadow-sm focus:ring-4 transition-all bg-white text-left font-medium hover:shadow-md"
      :class="[
        isOpen ? 'border-purple-500 ring-4 ring-purple-200' : 'border-purple-300 hover:border-purple-400'
      ]"
      :style="{ borderColor: isOpen ? primaryColor : '' }"
    >
      <span v-if="!selectedDate" class="text-gray-500">
        Selecciona una fecha
      </span>
      <span v-else class="text-gray-900">
        {{ formatDate(selectedDate) }}
      </span>
    </button>
    
    <!-- Icono de calendario -->
    <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5" :style="{ color: primaryColor }">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    </div>

    <!-- Dropdown del calendario -->
    <transition name="calendar-fade">
      <div
        v-if="isOpen"
        ref="calendarDropdown"
        class="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 w-full max-w-[280px]"
        @click.stop
      >
        <!-- Header con navegación de mes -->
        <div class="flex items-center justify-between mb-1.5">
          <button
            @click="previousMonth"
            type="button"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            :disabled="isCurrentMonth && currentYear === new Date().getFullYear()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <div class="text-center">
            <h3 class="font-bold text-sm text-gray-900">{{ monthNames[currentMonth] }} {{ currentYear }}</h3>
          </div>
          
          <button
            @click="nextMonth"
            type="button"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <!-- Días de la semana -->
        <div class="grid grid-cols-7 gap-0.5 mb-0.5">
          <div
            v-for="day in ['L', 'M', 'X', 'J', 'V', 'S', 'D']"
            :key="day"
            class="text-center text-[10px] font-semibold text-gray-600 py-0.5"
          >
            {{ day }}
          </div>
        </div>

        <!-- Grid de días del mes -->
        <div class="grid grid-cols-7 gap-0.5">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="aspect-square"
          >
            <button
              v-if="day"
              @click="selectDate(day)"
              type="button"
              :disabled="isDisabledDate(day)"
              class="w-full h-full rounded-lg text-xs font-medium transition-all"
              :class="[
                isSelectedDate(day) 
                  ? 'text-white shadow-lg transform scale-105' 
                  : isDisabledDate(day)
                  ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                  : isToday(day)
                  ? 'bg-gray-100 text-gray-900 font-bold hover:bg-gray-200'
                  : 'text-gray-700 hover:bg-purple-50'
              ]"
              :style="isSelectedDate(day) ? { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` } : {}"
            >
              {{ day.getDate() }}
            </button>
          </div>
        </div>

        <!-- Footer con botones -->
        <div class="flex gap-1.5 mt-2 pt-2 border-t border-gray-200">
          <button
            @click="selectToday"
            type="button"
            class="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
          >
            Hoy
          </button>
          <button
            @click="clearDate"
            type="button"
            class="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>
    </transition>

    <!-- Overlay para cerrar al hacer click fuera -->
    <div
      v-if="isOpen"
      @click="closeCalendar"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  primaryColor: {
    type: String,
    default: '#9333ea'
  },
  secondaryColor: {
    type: String,
    default: '#ec4899'
  },
  closedDays: {
    type: Array,
    default: () => [] // Array de números 0-6 (0=Domingo, 1=Lunes, etc.)
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref(props.modelValue ? new Date(props.modelValue) : null);
const calendarDropdown = ref(null);

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Computed para verificar si estamos en el mes actual
const isCurrentMonth = computed(() => {
  const today = new Date();
  return currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
});

// Generar días del mes
const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const daysInMonth = lastDay.getDate();
  let startDayOfWeek = firstDay.getDay(); // 0 = Domingo
  // Ajustar para que lunes sea 0: (0=Dom -> 6, 1=Lun -> 0, 2=Mar -> 1, etc.)
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const days = [];
  
  // Espacios vacíos al inicio
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(currentYear.value, currentMonth.value, day));
  }
  
  return days;
});

async function toggleCalendar() {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    await nextTick();
    if (calendarDropdown.value) {
      calendarDropdown.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }
}

function closeCalendar() {
  isOpen.value = false;
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  
  // No permitir ir antes del mes actual
  const today = new Date();
  if (currentYear.value < today.getFullYear() || 
      (currentYear.value === today.getFullYear() && currentMonth.value < today.getMonth())) {
    currentMonth.value = today.getMonth();
    currentYear.value = today.getFullYear();
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function selectDate(date) {
  if (isDisabledDate(date)) return;
  
  selectedDate.value = date;
  // Formatear fecha manualmente para evitar problemas de zona horaria
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  emit('update:modelValue', formattedDate);
  closeCalendar();
}

function selectToday() {
  selectDate(new Date());
}

function clearDate() {
  selectedDate.value = null;
  emit('update:modelValue', null);
  closeCalendar();
}

function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isClosedDay(date) {
  const dayOfWeek = date.getDay();
  return props.closedDays.includes(dayOfWeek);
}

function isDisabledDate(date) {
  return isPastDate(date) || isClosedDay(date);
}

function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

function isSelectedDate(date) {
  if (!selectedDate.value) return false;
  return date.getDate() === selectedDate.value.getDate() &&
         date.getMonth() === selectedDate.value.getMonth() &&
         date.getFullYear() === selectedDate.value.getFullYear();
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Watch para actualizar cuando cambie el modelValue desde fuera
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedDate.value = new Date(newValue);
    currentMonth.value = selectedDate.value.getMonth();
    currentYear.value = selectedDate.value.getFullYear();
  } else {
    selectedDate.value = null;
  }
});
</script>

<style scoped>
.calendar-fade-enter-active,
.calendar-fade-leave-active {
  transition: all 0.2s ease;
}

.calendar-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.calendar-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
