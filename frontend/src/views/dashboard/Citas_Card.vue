<template>
  <div
    :class="[
      'p-4 rounded-xl shadow-sm',
      estadoClass,
      'border-l-4',
      borderClass,
    ]"
  >
    <p :class="['font-medium', nombreClass]">{{ nombre }}</p>
    <p :class="['text-sm', telefonoClass]">{{ telefono }}</p>
    <p :class="['text-sm', fechaClass]">{{ fecha }}</p>
    <p :class="['text-sm font-medium', servicioClass]">{{ servicio }}</p>

    <!-- Estado -->
    <span
      :class="[
        'inline-block mt-2 px-2 py-1 text-xs font-semibold rounded',
        estadoBadgeClass,
      ]"
    >
      Estado: {{ estado }}
    </span>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  nombre: String,
  telefono: String,
  fecha: String,
  servicio: { type: String, default: 'Corte caballero' },
  estado: { type: String, default: 'Activo' }, // Activo | Finalizado | Cancelado
});

// Colores dinámicos en función del estado
const estadoClass = computed(() => {
  if (props.estado === 'Finalizado') return 'bg-gray-100';
  if (props.estado === 'Cancelado') return 'bg-red-50';
  return 'bg-gray-50'; // Activo
});

const borderClass = computed(() => {
  if (props.estado === 'Finalizado') return 'border-gray-400';
  if (props.estado === 'Cancelado') return 'border-red-400';
  return 'border-green-400'; // Activo
});

// Texto dinámico
const nombreClass = computed(() => {
  return props.estado === 'Finalizado' ? 'text-gray-500' : 'text-gray-900';
});

const telefonoClass = computed(() => {
  return props.estado === 'Finalizado' ? 'text-gray-400' : 'text-gray-500';
});

const fechaClass = computed(() => {
  return props.estado === 'Finalizado' ? 'text-gray-400' : 'text-gray-500';
});

const servicioClass = computed(() => {
  if (props.estado === 'Finalizado') return 'text-gray-400 line-through';
  if (props.estado === 'Cancelado') return 'text-red-600';
  return 'text-purple-600';
});

// Badge
const estadoBadgeClass = computed(() => {
  if (props.estado === 'Finalizado') return 'bg-gray-200 text-gray-600';
  if (props.estado === 'Cancelado') return 'bg-red-100 text-red-700';
  return 'bg-green-100 text-green-700'; // Activo
});
</script>
