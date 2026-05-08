<template>
  <div
    class="cc-root relative"
    :style="{ '--cc-primary': primaryColor, '--cc-secondary': secondaryColor }"
  >
    <button
      type="button"
      @click="toggleCalendar"
      class="date-dropdown-trigger cc-cal-field"
      :class="{ 'cc-cal-field--no-icon': hideTriggerIcon }"
      :aria-expanded="isOpen"
      :style="triggerDynamicStyle"
    >
      <span v-if="!hideTriggerIcon" class="cc-cal-field-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </span>
      <span class="date-dropdown-trigger-label">
        <span v-if="!selectedDate" class="cc-cal-placeholder">{{ placeholder }}</span>
        <span v-else class="cc-cal-value">{{ displayLabel }}</span>
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="date-dropdown-chevron"
        :class="{ 'date-dropdown-chevron--open': isOpen }"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <transition name="calendar-fade">
      <div
        v-if="isOpen"
        ref="calendarDropdown"
        class="date-dropdown-panel cc-cal-panel"
        @click.stop
      >
        <div class="cc-cal-panel-strip" aria-hidden="true" />

        <div class="cc-cal-nav">
          <button
            type="button"
            @click="previousMonth"
            class="cc-cal-nav-btn"
            :disabled="!allowPast && isCurrentMonth && currentYear === new Date().getFullYear()"
            aria-label="Mes anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cc-cal-nav-svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div class="cc-cal-month-wrap">
            <p class="cc-cal-month-label">Mes</p>
            <p class="cc-cal-month-title">{{ monthNames[currentMonth] }} {{ currentYear }}</p>
          </div>
          <button type="button" class="cc-cal-nav-btn" aria-label="Mes siguiente" @click="nextMonth">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cc-cal-nav-svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div class="cc-weekdays">
          <div v-for="day in ['L', 'M', 'X', 'J', 'V', 'S', 'D']" :key="day" class="cc-weekday">
            {{ day }}
          </div>
        </div>

        <div class="cc-days-grid">
          <div v-for="(day, index) in calendarDays" :key="index" class="cc-day-slot">
            <button
              v-if="day"
              type="button"
              @click="selectDate(day)"
              :disabled="isDisabledDate(day)"
              class="cc-day-cell"
              :class="dayCellClasses(day)"
              :style="isSelectedDate(day) ? selectedDayGradientStyle : undefined"
            >
              {{ day.getDate() }}
            </button>
          </div>
        </div>

        <div class="cc-footer">
          <button type="button" @click="selectToday" class="cc-footer-btn cc-footer-btn--primary">
            Hoy
          </button>
          <button type="button" @click="clearDate" class="cc-footer-btn cc-footer-btn--ghost">
            Limpiar
          </button>
        </div>
      </div>
    </transition>

    <div v-if="isOpen" class="fixed inset-0 z-40 cc-backdrop" @click="closeCalendar" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  primaryColor: {
    type: String,
    default: '#667eea',
  },
  secondaryColor: {
    type: String,
    default: '#764ba2',
  },
  closedDays: {
    type: Array,
    default: () => [],
  },
  /** Citas públicas: no permitir pasado. Informes: true */
  allowPast: {
    type: Boolean,
    default: false,
  },
  compactLabel: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Selecciona una fecha',
  },
  emitEmptyString: {
    type: Boolean,
    default: false,
  },
  /** Sin icono de calendario en el trigger (misma línea que desplegables de texto en Informes/Citas). */
  hideTriggerIcon: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref(null);
const calendarDropdown = ref(null);

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const triggerDynamicStyle = computed(() => {
  if (!isOpen.value) return {};
  return {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.12)',
  };
});

const selectedDayGradientStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.primaryColor}, ${props.secondaryColor})`,
}));

function parseModel(value) {
  const s = value != null ? String(value).trim() : '';
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function syncFromModel(value) {
  const d = parseModel(value);
  selectedDate.value = d;
  if (d) {
    currentMonth.value = d.getMonth();
    currentYear.value = d.getFullYear();
  }
}

watch(() => props.modelValue, syncFromModel, { immediate: true });

const displayLabel = computed(() => formatDate(selectedDate.value));

const isCurrentMonth = computed(() => {
  const today = new Date();
  return currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
});

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const daysInMonth = lastDay.getDate();
  let startDayOfWeek = firstDay.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(currentYear.value, currentMonth.value, day));
  }
  return days;
});

function dayCellClasses(day) {
  return [
    isSelectedDate(day) ? 'cc-day-cell--selected' : '',
    isDisabledDate(day) ? 'cc-day-cell--disabled' : '',
    !isDisabledDate(day) && isWeekend(day) && !isSelectedDate(day) ? 'cc-day-cell--weekend' : '',
    isToday(day) && !isSelectedDate(day) ? 'cc-day-cell--today' : '',
  ].filter(Boolean);
}

async function toggleCalendar() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    calendarDropdown.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  if (!props.allowPast) {
    const today = new Date();
    if (
      currentYear.value < today.getFullYear()
      || (currentYear.value === today.getFullYear() && currentMonth.value < today.getMonth())
    ) {
      currentMonth.value = today.getMonth();
      currentYear.value = today.getFullYear();
    }
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
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  emit('update:modelValue', `${y}-${m}-${d}`);
  closeCalendar();
}

function selectToday() {
  selectDate(new Date());
}

function clearDate() {
  selectedDate.value = null;
  emit('update:modelValue', props.emitEmptyString ? '' : null);
  closeCalendar();
}

function isPastDate(date) {
  if (props.allowPast) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isClosedDay(date) {
  return props.closedDays.includes(date.getDay());
}

function isDisabledDate(date) {
  return isPastDate(date) || isClosedDay(date);
}

function isWeekend(date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear()
  );
}

function isSelectedDate(date) {
  if (!selectedDate.value) return false;
  return (
    date.getDate() === selectedDate.value.getDate()
    && date.getMonth() === selectedDate.value.getMonth()
    && date.getFullYear() === selectedDate.value.getFullYear()
  );
}

function formatDate(date) {
  if (!date) return '';
  if (props.compactLabel) {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
.cc-root {
  --cc-muted: #64748b;
}

/* Campo cerrado: misma línea visual que otros desplegables (date-dropdown-*) */
.cc-cal-field {
  width: 100%;
}

.cc-cal-field--no-icon {
  /* Mismo ritmo que .date-dropdown-trigger sin columna de icono */
  gap: 0.5rem;
}

.cc-cal-field--no-icon .cc-cal-placeholder {
  color: #94a3b8;
  font-weight: 600;
}

.cc-cal-field--no-icon .cc-cal-value {
  color: #475569;
  font-weight: 600;
}

.cc-cal-field-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: #f1f5f9;
  color: #64748b;
}

.cc-cal-field-icon svg {
  width: 1.125rem;
  height: 1.125rem;
}

.cc-cal-placeholder {
  color: var(--cc-muted);
  font-weight: 500;
}

.cc-cal-value {
  color: #1e293b;
  font-weight: 600;
}

/* Panel abierto: card alineada con date-dropdown-panel + barra de marca
   Debe quedar POR ENCIMA del .cc-backdrop (z-40): mismo índice = el backdrop
   (renderizado después) tapaba el panel e impedía clics en días/botones. */
.cc-cal-panel {
  max-height: none;
  padding: 0;
  overflow: hidden;
  z-index: 50;
}

.cc-cal-panel-strip {
  height: 3px;
  background: linear-gradient(90deg, var(--cc-primary), var(--cc-secondary));
}

.cc-cal-nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.45rem 0.35rem;
  border-bottom: 1px solid #f1f5f9;
}

.cc-cal-nav-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #fff;
  color: #475569;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.cc-cal-nav-btn:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--cc-primary) 35%, #e2e8f0);
  color: var(--cc-primary);
  background: #f8fafc;
}

.cc-cal-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.cc-cal-nav-svg {
  width: 1.125rem;
  height: 1.125rem;
}

.cc-cal-month-wrap {
  flex: 1;
  min-width: 0;
  text-align: center;
}

.cc-cal-month-label {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.cc-cal-month-title {
  margin: 0.1rem 0 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.02em;
}

.cc-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.2rem;
  padding: 0.35rem 0.5rem 0.25rem;
  background: #fafafa;
  border-bottom: 1px solid #f1f5f9;
}

.cc-weekday {
  text-align: center;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  padding: 0.2rem 0;
}

.cc-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  padding: 0.45rem 0.5rem 0.55rem;
  background: #fff;
}

.cc-day-slot {
  aspect-ratio: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cc-day-cell {
  width: 2.125rem;
  height: 2.125rem;
  max-width: 100%;
  max-height: 100%;
  border: none;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
  background: #fff;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
  box-shadow: inset 0 0 0 1px transparent;
}

.cc-day-cell--weekend {
  background: #f8fafc;
  color: #64748b;
}

.cc-day-cell:hover:not(:disabled):not(.cc-day-cell--selected):not(.cc-day-cell--disabled) {
  transform: scale(1.05);
  color: var(--cc-primary);
  background: #fff;
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--cc-primary) 40%, transparent);
}

.cc-day-cell--today:not(.cc-day-cell--selected) {
  background: color-mix(in srgb, var(--cc-primary) 8%, #fff);
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--cc-primary) 35%, transparent);
}

.cc-day-cell--selected {
  color: #fff !important;
  box-shadow:
    0 4px 14px color-mix(in srgb, var(--cc-primary) 35%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transform: scale(1.04);
}

.cc-day-cell--disabled {
  color: #cbd5e1 !important;
  background: #f9fafb !important;
  cursor: not-allowed;
  opacity: 0.8;
  box-shadow: none !important;
  transform: none !important;
}

.cc-footer {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-top: 1px solid #f1f5f9;
  background: #fafafa;
}

.cc-footer-btn {
  flex: 1;
  padding: 0.5rem 0.65rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
}

.cc-footer-btn--primary {
  color: #fff;
  background: linear-gradient(135deg, var(--cc-primary), var(--cc-secondary));
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.22);
}

.cc-footer-btn--primary:hover {
  filter: brightness(1.04);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.28);
}

.cc-footer-btn--ghost {
  background: #fff;
  color: #475569;
  border-color: #e2e8f0;
}

.cc-footer-btn--ghost:hover {
  border-color: color-mix(in srgb, var(--cc-primary) 40%, #e2e8f0);
  color: var(--cc-primary);
}

.cc-backdrop {
  cursor: default;
}

.calendar-fade-enter-active,
.calendar-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.calendar-fade-enter-from,
.calendar-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
