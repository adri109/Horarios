<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from '@/utils/axios';
import { useRouter } from 'vue-router';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
const router = useRouter();

// Sistema de notificaciones toast
const toasts = ref([]);
let toastIdCounter = 0;

const showToast = (message, type = 'info') => {
  const id = toastIdCounter++;
  toasts.value.push({ id, message, type });
  
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 5000);
};

const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};

// Solo admin puede acceder a configuración
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.role !== 'ADMIN') {
  router.push('/dashboard/resume');
}

const loading = ref(true);
const saving = ref(false);

// Estado de las pestañas
const activeTab = ref('info'); // 'info', 'schedule', 'public', 'notifications'

// Datos del salón
const salonInfo = ref({
  name: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  email: '',
  description: ''
});

// Configuración general
const config = ref({
  canAcceptAppointments: true,
  openingTime: '09:00',
  closingTime: '18:00',
  serviceIntervalMinutes: 30
});

// Horarios semanales
const weekDays = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
  { id: 0, name: 'Domingo' }
];

const schedules = ref([]);

// Modo de configuración de horarios
const scheduleMode = ref('quick'); // 'quick' o 'manual'

// Estado de advertencia de solapamiento
const overlappingDays = ref([]);

// Aplicación rápida de horarios - ahora soporta múltiples rangos y turnos
const quickScheduleRanges = ref([
  {
    id: 1,
    fromDay: 1, // Lunes
    toDay: 5,   // Viernes
    shifts: [
      { id: 1, openingTime: '09:00', closingTime: '18:00' }
    ]
  }
]);

let nextRangeId = 2;
let nextShiftId = 2;

// Watch para actualizar solapamientos automáticamente
watch(quickScheduleRanges, () => {
  overlappingDays.value = detectOverlappingDays();
}, { deep: true });

// Añadir nuevo rango de días
const addDayRange = () => {
  quickScheduleRanges.value.push({
    id: nextRangeId++,
    fromDay: 6, // Sábado por defecto
    toDay: 0,   // Domingo
    shifts: [
      { id: nextShiftId++, openingTime: '10:00', closingTime: '14:00' }
    ]
  });
};

// Eliminar rango de días
const removeDayRange = (rangeId) => {
  if (quickScheduleRanges.value.length === 1) {
    showToast('Debe haber al menos un rango de días', 'warning');
    return;
  }
  quickScheduleRanges.value = quickScheduleRanges.value.filter(r => r.id !== rangeId);
};

// Añadir turno extra a un rango
const addShiftToRange = (range) => {
  if (range.shifts.length >= 3) {
    showToast('Máximo 3 turnos por día', 'warning');
    return;
  }
  
  // Calcular hora de inicio basada en el último turno
  const lastShift = range.shifts[range.shifts.length - 1];
  const [hours, minutes] = lastShift.closingTime.split(':').map(Number);
  
  // Añadir 1 hora de descanso
  let newOpenHours = hours + 1;
  let newCloseHours = hours + 5; // 4 horas de turno
  
  if (newOpenHours >= 24) newOpenHours = 23;
  if (newCloseHours >= 24) newCloseHours = 23;
  
  range.shifts.push({
    id: nextShiftId++,
    openingTime: `${String(newOpenHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    closingTime: `${String(newCloseHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  });
};

// Eliminar turno de un rango
const removeShiftFromRange = (range, shiftId) => {
  if (range.shifts.length === 1) {
    showToast('Debe haber al menos un turno', 'warning');
    return;
  }
  range.shifts = range.shifts.filter(s => s.id !== shiftId);
};

// Obtener días de un rango
const getDaysInRange = (fromDay, toDay) => {
  const days = [];
  if (fromDay <= toDay) {
    for (let day = fromDay; day <= toDay; day++) {
      days.push(day);
    }
  } else {
    // Caso especial: atraviesa la semana (ej: Sábado 6 -> Domingo 0)
    for (let day = fromDay; day <= 6; day++) {
      days.push(day);
    }
    for (let day = 0; day <= toDay; day++) {
      days.push(day);
    }
  }
  return days;
};

// Detectar días que aparecen en múltiples rangos
const detectOverlappingDays = () => {
  const overlapping = [];
  
  // Comparar cada par de rangos
  for (let i = 0; i < quickScheduleRanges.value.length; i++) {
    for (let j = i + 1; j < quickScheduleRanges.value.length; j++) {
      const range1 = quickScheduleRanges.value[i];
      const range2 = quickScheduleRanges.value[j];
      
      // Obtener los días de cada rango
      const days1 = getDaysInRange(range1.fromDay, range1.toDay);
      const days2 = getDaysInRange(range2.fromDay, range2.toDay);
      
      // Encontrar días en común
      const commonDays = days1.filter(day => days2.includes(day));
      
      if (commonDays.length > 0) {
        // Hay días en común, ahora verificar si los horarios se solapan
        let hasTimeOverlap = false;
        
        // Comparar cada turno del rango 1 con cada turno del rango 2
        for (const shift1 of range1.shifts) {
          for (const shift2 of range2.shifts) {
            // Verificar si hay solapamiento de horarios
            const start1 = shift1.openingTime;
            const end1 = shift1.closingTime;
            const start2 = shift2.openingTime;
            const end2 = shift2.closingTime;
            
            // Dos rangos de tiempo se solapan si:
            // - El inicio de uno está entre el inicio y fin del otro, o
            // - El fin de uno está entre el inicio y fin del otro, o
            // - Uno contiene completamente al otro
            if ((start1 < end2 && end1 > start2)) {
              hasTimeOverlap = true;
              break;
            }
          }
          if (hasTimeOverlap) break;
        }
        
        // Solo agregar a overlapping si HAY días en común Y horarios solapados
        if (hasTimeOverlap) {
          commonDays.forEach(day => {
            const dayName = weekDays.find(d => d.id === day)?.name;
            const existing = overlapping.find(o => o.day === day);
            if (!existing) {
              overlapping.push({ 
                day, 
                dayName, 
                ranges: `${i + 1}, ${j + 1}` 
              });
            }
          });
        }
      }
    }
  }
  
  overlappingDays.value = overlapping;
  return overlapping;
};

// Validar que los turnos no se solapen
const validateShifts = (shifts) => {
  for (let i = 0; i < shifts.length; i++) {
    for (let j = i + 1; j < shifts.length; j++) {
      const shift1 = shifts[i];
      const shift2 = shifts[j];
      
      // Convertir a minutos para comparar
      const [h1Start, m1Start] = shift1.openingTime.split(':').map(Number);
      const [h1End, m1End] = shift1.closingTime.split(':').map(Number);
      const [h2Start, m2Start] = shift2.openingTime.split(':').map(Number);
      const [h2End, m2End] = shift2.closingTime.split(':').map(Number);
      
      const start1 = h1Start * 60 + m1Start;
      const end1 = h1End * 60 + m1End;
      const start2 = h2Start * 60 + m2Start;
      const end2 = h2End * 60 + m2End;
      
      // Verificar solapamiento
      if ((start1 < end2 && end1 > start2) || (start2 < end1 && end2 > start1)) {
        return false;
      }
    }
  }
  return true;
};

// Modal de confirmación
const showConfirmModal = ref(false);
const confirmModalData = ref({ title: '', message: '', onConfirm: null });

const confirm = (title, message) => {
  return new Promise((resolve) => {
    confirmModalData.value = {
      title,
      message,
      onConfirm: () => {
        showConfirmModal.value = false;
        resolve(true);
      },
      onCancel: () => {
        showConfirmModal.value = false;
        resolve(false);
      }
    };
    showConfirmModal.value = true;
  });
};

// Aplicar horario rápido a múltiples días
const applyQuickSchedule = async () => {
  try {
    // Validar todos los rangos
    for (const range of quickScheduleRanges.value) {
      if (range.fromDay > range.toDay && !(range.fromDay === 6 && range.toDay === 0)) {
        // Permitir Sábado (6) a Domingo (0)
        if (!(range.fromDay > range.toDay)) {
          showToast('Revisa los rangos de días: el día de inicio debe ser anterior o igual al día final', 'error');
          return;
        }
      }
      
      // Validar que los turnos no se solapen DENTRO del mismo rango
      if (!validateShifts(range.shifts)) {
        showToast('Los horarios de los turnos se solapan dentro de un rango. Por favor, ajústalos.', 'error');
        return;
      }
      
      // Validar que cada turno tenga cierre después de apertura
      for (const shift of range.shifts) {
        if (shift.openingTime >= shift.closingTime) {
          showToast('La hora de cierre debe ser posterior a la hora de apertura', 'error');
          return;
        }
      }
    }
    
    // Detectar días solapados
    const overlapping = detectOverlappingDays();
    
    // Si hay solapamientos, no permitir continuar
    if (overlapping.length > 0) {
      const daysText = overlapping.map(o => o.dayName).join(', ');
      showToast(`No se pueden aplicar los horarios. Días solapados: ${daysText}. Modifica los rangos para continuar.`, 'error');
      return;
    }
    
    // Crear mapa de día -> array de turnos (combinando todos los rangos)
    const dayShiftsMap = new Map();
    
    for (const range of quickScheduleRanges.value) {
      const daysInRange = getDaysInRange(range.fromDay, range.toDay);
      
      for (const dayOfWeek of daysInRange) {
        if (!dayShiftsMap.has(dayOfWeek)) {
          dayShiftsMap.set(dayOfWeek, []);
        }
        
        // Añadir todos los turnos de este rango a este día
        range.shifts.forEach(shift => {
          dayShiftsMap.get(dayOfWeek).push({
            openingTime: shift.openingTime,
            closingTime: shift.closingTime
          });
        });
      }
    }
    
    // Crear resumen agrupado por día mostrando todos los turnos
    const summaryByDay = new Map();
    
    for (const [dayOfWeek, shifts] of dayShiftsMap.entries()) {
      const dayName = weekDays.find(d => d.id === dayOfWeek)?.name;
      const shiftsText = shifts.map(s => `${s.openingTime}-${s.closingTime}`).join(', ');
      summaryByDay.set(dayName, shiftsText);
    }
    
    const summary = Array.from(summaryByDay.entries())
      .map(([dayName, shiftsText]) => `${dayName}: ${shiftsText}`)
      .join('\n');
    
    const confirmed = await confirm('¿Aplicar estos horarios?', summary);
    if (!confirmed) return;
    
    const token = localStorage.getItem('token');
    
    // Eliminar horarios existentes de todos los días afectados
    const allDaysToApply = Array.from(dayShiftsMap.keys());
    for (const dayOfWeek of allDaysToApply) {
      const existingSchedules = getSchedulesForDay(dayOfWeek);
      for (const schedule of existingSchedules) {
        await axios.delete(`${API_URL}/config/schedules/${schedule.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      // Limpiar del array local también
      schedules.value = schedules.value.filter(s => s.dayOfWeek !== dayOfWeek);
    }
    
    // Crear nuevos horarios para cada día
    for (const [dayOfWeek, shifts] of dayShiftsMap.entries()) {
      // Ordenar turnos por hora de apertura
      const sortedShifts = [...shifts].sort((a, b) => 
        a.openingTime.localeCompare(b.openingTime)
      );
      
      // Eliminar duplicados exactos (misma hora de apertura y cierre)
      const uniqueShifts = [];
      const seen = new Set();
      
      for (const shift of sortedShifts) {
        const key = `${shift.openingTime}-${shift.closingTime}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueShifts.push(shift);
        }
      }
      
      console.log(`Creando ${uniqueShifts.length} turnos para día ${dayOfWeek}:`, uniqueShifts);
      
      // Crear cada turno único
      for (const shift of uniqueShifts) {
        const response = await axios.post(`${API_URL}/config/schedules`, {
          dayOfWeek,
          openingTime: shift.openingTime,
          closingTime: shift.closingTime,
          isClosed: false
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        schedules.value.push(response.data);
      }
    }
    
    // Recargar configuración para asegurar consistencia
    await fetchConfig();
    
    console.log('Horarios aplicados masivamente (solapamientos combinados)');
    showToast('Horarios aplicados correctamente', 'success');
  } catch (error) {
    console.error('Error aplicando horarios:', error);
    showToast('Error al aplicar los horarios', 'error');
  }
};

// Bloqueos
const blocks = ref([]);
const showBlockModal = ref(false);
const newBlock = ref({
  date: '',
  startTime: '09:00',
  endTime: '18:00',
  reason: ''
});

// Cargar configuración
const fetchConfig = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/config`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Configuración recibida:', response.data);
    
    if (response.data.config) {
      config.value = response.data.config;
    }
    
    schedules.value = response.data.schedules || [];
    blocks.value = response.data.blocks || [];
    
    // Cargar información del salón
    if (response.data.salon) {
      salonInfo.value.name = response.data.salon.name || '';
      salonInfo.value.address = response.data.salon.address || '';
      salonInfo.value.city = response.data.salon.city || '';
      salonInfo.value.phone = response.data.salon.phone || '';
      salonInfo.value.description = response.data.salon.description || '';
    }
    
  } catch (error) {
    console.error('Error cargando configuración:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  } finally {
    loading.value = false;
  }
};

// Guardar información del salón
const saveSalonInfo = async () => {
  try {
    saving.value = true;
    
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/salon/info`, {
      name: salonInfo.value.name,
      address: salonInfo.value.address,
      city: salonInfo.value.city,
      phone: salonInfo.value.phone,
      description: salonInfo.value.description
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    showToast('Información del salón guardada correctamente', 'success');
    console.log('Info guardada:', response.data);
    
  } catch (error) {
    console.error('Error guardando información:', error);
    showToast('Error al guardar la información', 'error');
  } finally {
    saving.value = false;
  }
};

// Guardar configuración general
const saveConfig = async () => {
  try {
    saving.value = true;
    const token = localStorage.getItem('token');
    
    await axios.put(`${API_URL}/config`, config.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Configuración guardada');
  } catch (error) {
    console.error('Error guardando configuración:', error);
  } finally {
    saving.value = false;
  }
};

// Obtener horarios de un día específico (puede haber varios)
const getSchedulesForDay = (dayOfWeek) => {
  return schedules.value.filter(s => s.dayOfWeek === dayOfWeek);
};

// Verificar si un día está marcado como cerrado
const isDayClosed = (dayOfWeek) => {
  const daySchedules = getSchedulesForDay(dayOfWeek);
  return daySchedules.length > 0 && daySchedules[0].isClosed;
};

// Agregar nuevo horario a un día
const addScheduleSlot = async (dayOfWeek) => {
  try {
    const token = localStorage.getItem('token');
    const existingSchedules = getSchedulesForDay(dayOfWeek);
    
    let newOpeningTime = config.value.openingTime;
    let newClosingTime = config.value.closingTime;
    
    if (existingSchedules.length > 0) {
      // Ordenar por hora de cierre para encontrar el último horario
      const sortedSchedules = [...existingSchedules].sort((a, b) => 
        a.closingTime.localeCompare(b.closingTime)
      );
      const lastSchedule = sortedSchedules[sortedSchedules.length - 1];
      
      // El nuevo horario DEBE empezar exactamente donde termina el último
      newOpeningTime = lastSchedule.closingTime;
      
      // Calcular hora de cierre (2 horas después por defecto)
      const [hours, minutes] = newOpeningTime.split(':').map(Number);
      let closingHours = hours + 2;
      
      // Validar que no exceda las 23:59
      if (closingHours >= 24) {
        closingHours = 23;
        newClosingTime = '23:59';
      } else {
        newClosingTime = `${String(closingHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      
      // Validar que el nuevo horario no sea igual o menor que el de apertura
      if (newClosingTime <= newOpeningTime) {
        alert('No se puede añadir más horarios. El último horario ya termina muy tarde.');
        return;
      }
    }
    
    const response = await axios.post(`${API_URL}/config/schedules`, {
      dayOfWeek,
      openingTime: newOpeningTime,
      closingTime: newClosingTime,
      isClosed: false
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    schedules.value.push(response.data);
    console.log('Horario añadido');
  } catch (error) {
    console.error('Error añadiendo horario:', error);
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    }
  }
};

// Actualizar horario existente
const updateScheduleSlot = async (schedule) => {
  try {
    const token = localStorage.getItem('token');
    
    await axios.put(`${API_URL}/config/schedules/${schedule.id}`, {
      openingTime: schedule.openingTime,
      closingTime: schedule.closingTime,
      isClosed: schedule.isClosed
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Horario actualizado');
  } catch (error) {
    console.error('Error actualizando horario:', error);
  }
};

// Eliminar horario
const deleteScheduleSlot = async (scheduleId) => {
  if (!confirm('¿Estás seguro de eliminar este horario?')) return;
  
  try {
    const token = localStorage.getItem('token');
    
    await axios.delete(`${API_URL}/config/schedules/${scheduleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    schedules.value = schedules.value.filter(s => s.id !== scheduleId);
    console.log('Horario eliminado');
  } catch (error) {
    console.error('Error eliminando horario:', error);
  }
};

// Marcar día como cerrado
const toggleDayClosed = async (dayOfWeek) => {
  try {
    const daySchedules = getSchedulesForDay(dayOfWeek);
    const token = localStorage.getItem('token');
    
    // Si ya hay horarios, actualizar el primero como cerrado
    if (daySchedules.length > 0) {
      const schedule = daySchedules[0];
      schedule.isClosed = !schedule.isClosed;
      await updateScheduleSlot(schedule);
    } else {
      // Si no hay horarios, crear uno cerrado
      const response = await axios.post(`${API_URL}/config/schedules`, {
        dayOfWeek,
        openingTime: config.value.openingTime,
        closingTime: config.value.closingTime,
        isClosed: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      schedules.value.push(response.data);
    }
    
    console.log('Estado actualizado');
  } catch (error) {
    console.error('Error actualizando estado:', error);
  }
};

// Abrir modal de bloqueo
const openBlockModal = () => {
  newBlock.value = {
    date: '',
    startTime: '09:00',
    endTime: '18:00',
    reason: ''
  };
  showBlockModal.value = true;
};

// Crear bloqueo
const createBlock = async () => {
  try {
    if (!newBlock.value.date) {
      showToast('Por favor selecciona una fecha', 'warning');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_URL}/config/blocks`, newBlock.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    blocks.value.push(response.data);
    showBlockModal.value = false;
    console.log('Bloqueo creado');
  } catch (error) {
    console.error('Error creando bloqueo:', error);
  }
};

// Eliminar bloqueo
const deleteBlock = async (blockId) => {
  const confirmed = await confirm('¿Eliminar bloqueo?', '¿Estás seguro de eliminar este bloqueo?');
  if (!confirmed) return;
  
  try {
    const token = localStorage.getItem('token');
    
    await axios.delete(`${API_URL}/config/blocks/${blockId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    blocks.value = blocks.value.filter(b => b.id !== blockId);
    console.log('Bloqueo eliminado');
  } catch (error) {
    console.error('Error eliminando bloqueo:', error);
  }
};

// Formatear fecha
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchConfig();
});
</script>

<template>
  <div class="config-container">
    <div class="header">
      <h1 class="title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Configuración
      </h1>
      <p class="subtitle">Personaliza el funcionamiento de tu salón</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando configuración...</p>
    </div>

    <div v-else class="config-content">
      <!-- TABS -->
      <div class="tabs-container">
        <button 
          @click="activeTab = 'info'" 
          :class="['tab-button', { 'active': activeTab === 'info' }]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
          </svg>
          Información del Salón
        </button>
        
        <button 
          @click="activeTab = 'schedule'" 
          :class="['tab-button', { 'active': activeTab === 'schedule' }]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Horarios
        </button>
        
        <button 
          @click="activeTab = 'public'" 
          :class="['tab-button', { 'active': activeTab === 'public' }]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
          </svg>
          Página Pública
        </button>
        
        <button 
          @click="activeTab = 'notifications'" 
          :class="['tab-button', { 'active': activeTab === 'notifications' }]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          Notificaciones
        </button>
      </div>

      <!-- TAB: INFORMACIÓN DEL SALÓN -->
      <section v-if="activeTab === 'info'" class="config-section">
        <div class="section-header">
          <h2 class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
            Información del Salón
          </h2>
          <button @click="saveSalonInfo" :disabled="saving" class="btn-save flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>

        <div class="info-grid">
          <div class="info-group">
            <label class="info-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
              Nombre del Salón
            </label>
            <input 
              type="text" 
              v-model="salonInfo.name" 
              placeholder="Ej: Salón de Belleza Elegance"
              class="info-input"
            />
          </div>

          <div class="info-group span-2">
            <label class="info-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Dirección
            </label>
            <input 
              type="text" 
              v-model="salonInfo.address" 
              placeholder="Calle, número, piso..."
              class="info-input"
            />
          </div>

          <div class="info-group">
            <label class="info-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Ciudad
            </label>
            <input 
              type="text" 
              v-model="salonInfo.city" 
              placeholder="Ej: Madrid"
              class="info-input"
            />
          </div>

          <div class="info-group">
            <label class="info-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
              </svg>
              Código Postal
            </label>
            <input 
              type="text" 
              v-model="salonInfo.postalCode" 
              placeholder="Ej: 28001"
              class="info-input"
            />
          </div>

          <div class="info-group">
            <label class="info-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Teléfono
            </label>
            <input 
              type="tel" 
              v-model="salonInfo.phone" 
              placeholder="Ej: +34 912 345 678"
              class="info-input"
            />
          </div>

          <div class="info-group">
            <label class="info-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Email de Contacto
            </label>
            <input 
              type="email" 
              v-model="salonInfo.email" 
              placeholder="Ej: contacto@salon.com"
              class="info-input"
            />
          </div>

          <div class="info-group span-2">
            <label class="info-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              Descripción
            </label>
            <textarea 
              v-model="salonInfo.description" 
              placeholder="Describe tu salón, servicios destacados, años de experiencia..."
              rows="4"
              class="info-textarea"
            ></textarea>
          </div>
        </div>
      </section>

      <!-- TAB: HORARIOS -->
      <section v-if="activeTab === 'schedule'" class="config-section">
        <!-- CONFIGURACIÓN GENERAL DE HORARIOS -->
        <div class="section-header">
          <h2 class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuración General
          </h2>
          <button @click="saveConfig" :disabled="saving" class="btn-save flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
        
        <div class="config-grid">
          <div class="config-item">
            <label class="checkbox-label">
              <input type="checkbox" v-model="config.canAcceptAppointments" />
              <span>Aceptar citas online</span>
            </label>
            <p class="help-text">Si está activado, los clientes pueden reservar citas desde tu página pública. Si está desactivado, la página solo mostrará información del salón.</p>
          </div>
        </div>

        <div class="time-config">
          <div class="time-item">
            <label>Intervalo de servicios (minutos)</label>
            <input type="number" v-model="config.serviceIntervalMinutes" min="5" max="120" class="time-input" />
          </div>
        </div>

        <!-- HORARIOS SEMANALES -->
        <div class="section-divider"></div>
        
        <div class="section-header" style="margin-top: 2rem;">
          <h2 class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Horarios por Día de la Semana
          </h2>
        </div>
        
        <!-- Selector de modo -->
        <div class="mode-selector">
          <p class="mode-selector-label">Elige cómo quieres configurar los horarios:</p>
          <div class="mode-options">
            <label class="mode-option" :class="{ 'active': scheduleMode === 'quick' }">
              <input type="radio" v-model="scheduleMode" value="quick" />
              <div class="mode-content">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <div>
                  <span class="mode-title">Modo Rápido</span>
                  <span class="mode-description">Aplica horarios a varios días a la vez</span>
                </div>
              </div>
            </label>
            
            <label class="mode-option" :class="{ 'active': scheduleMode === 'manual' }">
              <input type="radio" v-model="scheduleMode" value="manual" />
              <div class="mode-content">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                <div>
                  <span class="mode-title">Modo Manual</span>
                  <span class="mode-description">Configura cada día individualmente</span>
                </div>
              </div>
            </label>
          </div>
        </div>
        
        <!-- Aplicación rápida de horarios -->
        <div v-if="scheduleMode === 'quick'" class="quick-schedule-box">
          <div class="quick-schedule-header">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-purple-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <h3>Aplicación Rápida de Horarios</h3>
          </div>
          <p class="quick-schedule-subtitle">Configura horarios por rangos de días. Añade turnos para horarios partidos (mañana y tarde).</p>
          
          <!-- Advertencia de días solapados -->
          <div v-if="overlappingDays.length > 0" class="overlap-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span>Horarios solapados</span>
          </div>
          
          <!-- Configuraciones de horarios -->
          <div class="quick-configs-container">
            <div v-for="range in quickScheduleRanges" :key="range.id" class="quick-config-row">
              <!-- Selector de días -->
              <div class="config-days-section">
                <span class="config-label">De</span>
                <select v-model.number="range.fromDay" class="quick-select-inline">
                  <option v-for="day in weekDays" :key="day.id" :value="day.id">{{ day.name }}</option>
                </select>
                
                <span class="config-label">a</span>
                <select v-model.number="range.toDay" class="quick-select-inline">
                  <option v-for="day in weekDays" :key="day.id" :value="day.id">{{ day.name }}</option>
                </select>
              </div>
              
              <!-- Flecha separadora -->
              <div class="config-arrow">→</div>
              
              <!-- Turnos horizontales -->
              <div class="config-shifts-section">
                <div v-for="(shift, shiftIndex) in range.shifts" :key="shift.id" class="config-shift-inline">
                  <span class="shift-separator" v-if="shiftIndex > 0">+</span>
                  
                  <div class="shift-time-group">
                    <span class="time-label">De</span>
                    <input type="time" v-model="shift.openingTime" class="time-input-inline" />
                    <span class="time-label">a</span>
                    <input type="time" v-model="shift.closingTime" class="time-input-inline" />
                  </div>
                  
                  <button 
                    v-if="range.shifts.length > 1"
                    @click="removeShiftFromRange(range, shift.id)"
                    class="btn-remove-shift-inline"
                    title="Eliminar turno"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <button @click="addShiftToRange(range)" class="btn-add-turno">
                  + Turno
                </button>
              </div>
              
              <!-- Botón eliminar configuración -->
              <button 
                v-if="quickScheduleRanges.length > 1"
                @click="removeDayRange(range.id)" 
                class="btn-remove-config"
                title="Eliminar configuración"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Botones de acción -->
          <div class="quick-actions-bottom">
            <button @click="addDayRange" class="btn-add-config">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Añadir otra configuración
            </button>
            
            <button @click="applyQuickSchedule" class="btn-apply-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Aplicar todos los horarios
            </button>
          </div>
        </div>
        
        <div class="schedules-table">
          <template v-if="scheduleMode === 'manual'">
            <div>
              <p class="subtitle-small" style="margin-bottom: 1rem;">Configura horarios específicos para cada día. Puedes añadir turnos partidos.</p>
            </div>
            <div v-for="day in weekDays" :key="day.id" class="schedule-row">
            <!-- Nombre del día -->
            <div class="day-name-col">{{ day.name }}</div>
            
            <!-- Checkbox cerrado -->
            <div class="closed-col">
              <label class="checkbox-inline">
                <input 
                  type="checkbox" 
                  :checked="isDayClosed(day.id)"
                  @change="() => toggleDayClosed(day.id)"
                />
                <span>Cerrado</span>
              </label>
            </div>
            
            <!-- Horarios -->
            <div class="schedules-col">
              <div v-if="!isDayClosed(day.id)" class="time-slots">
                <!-- Horarios existentes -->
                <div 
                  v-for="schedule in getSchedulesForDay(day.id)" 
                  :key="schedule.id" 
                  class="time-slot-row"
                >
                  <span class="slot-label">Apertura</span>
                  <input 
                    type="time" 
                    v-model="schedule.openingTime"
                    @change="() => updateScheduleSlot(schedule)"
                    class="time-input"
                  />
                  
                  <span class="slot-label">Cierre</span>
                  <input 
                    type="time" 
                    v-model="schedule.closingTime"
                    @change="() => updateScheduleSlot(schedule)"
                    class="time-input"
                  />
                  
                  <button 
                    v-if="getSchedulesForDay(day.id).length > 1"
                    @click="deleteScheduleSlot(schedule.id)" 
                    class="btn-remove"
                    title="Eliminar horario"
                  >
                    ✕
                  </button>
                </div>
                
                <!-- Botón añadir horario -->
                <button 
                  @click="addScheduleSlot(day.id)" 
                  class="btn-add-time"
                >
                  + Añadir horario
                </button>
              </div>
              
              <div v-else class="closed-text">
                Cerrado todo el día
              </div>
            </div>
          </div>
          </template>
        </div>

        <!-- BLOQUEOS DE FECHAS (dentro del tab de Horarios) -->
        <div class="section-divider"></div>
        
        <div class="section-header" style="margin-top: 2rem;">
          <h2 class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Bloqueos de Fechas
          </h2>
          <button @click="openBlockModal" class="btn-add flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Bloqueo
          </button>
        </div>
        
        <div v-if="blocks.length === 0" class="empty-state">
          <p>No hay bloqueos configurados</p>
          <p class="help-text">Los bloqueos impiden que se reserven citas en fechas específicas</p>
        </div>
        
        <div v-else class="blocks-list">
          <div v-for="block in blocks" :key="block.id" class="block-item">
            <div class="block-info">
              <div class="block-date flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {{ formatDate(block.date) }}
              </div>
              <div class="block-time flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ block.startTime }} - {{ block.endTime }}
              </div>
              <div v-if="block.reason" class="block-reason flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                {{ block.reason }}
              </div>
            </div>
            <button @click="deleteBlock(block.id)" class="btn-delete flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </section>

      <!-- TAB: PÁGINA PÚBLICA -->
      <section v-if="activeTab === 'public'" class="config-section">
        <div class="section-header">
          <h2 class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
            Personalización de Página Pública
          </h2>
        </div>

        <div class="coming-soon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
          </svg>
          <h3>Próximamente</h3>
          <p>Aquí podrás personalizar los colores, fondos y estilo de tu página pública.</p>
        </div>
      </section>

      <!-- TAB: NOTIFICACIONES -->
      <section v-if="activeTab === 'notifications'" class="config-section">
        <div class="section-header">
          <h2 class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            Configuración de Notificaciones
          </h2>
        </div>

        <div class="coming-soon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <h3>Próximamente</h3>
          <p>Aquí podrás configurar notificaciones por email, SMS y recordatorios automáticos.</p>
        </div>
      </section>
    </div>

    <!-- MODAL NUEVO BLOQUEO -->
    <div v-if="showBlockModal" class="modal-overlay" @click="showBlockModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Bloqueo
          </h2>
          <button @click="showBlockModal = false" class="close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Fecha</label>
            <input type="date" v-model="newBlock.date" class="form-input" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Hora inicio</label>
              <input type="time" v-model="newBlock.startTime" class="form-input" />
            </div>
            <div class="form-group">
              <label>Hora fin</label>
              <input type="time" v-model="newBlock.endTime" class="form-input" />
            </div>
          </div>
          
          <div class="form-group">
            <label>Motivo (opcional)</label>
            <input 
              type="text" 
              v-model="newBlock.reason" 
              placeholder="Ej: Vacaciones, evento especial..."
              class="form-input" 
            />
          </div>
          
          <button @click="createBlock" class="btn-create">
            Crear Bloqueo
          </button>
        </div>
      </div>
    </div>
    
    <!-- MODAL DE CONFIRMACIÓN -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="confirmModalData.onCancel">
      <div class="modal-content confirm-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ confirmModalData.title }}</h2>
          <button @click="confirmModalData.onCancel" class="close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <p class="confirm-message">{{ confirmModalData.message }}</p>
          
          <div class="confirm-actions">
            <button @click="confirmModalData.onCancel" class="btn-cancel">
              Cancelar
            </button>
            <button @click="confirmModalData.onConfirm" class="btn-confirm">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- SISTEMA DE NOTIFICACIONES TOAST -->
    <div class="toast-container">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        :class="['toast', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="toast.type === 'warning'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        <p class="toast-message">{{ toast.message }}</p>
        <button @click.stop="removeToast(toast.id)" class="toast-close">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title svg {
  color: #667eea;
  background: none;
  -webkit-text-fill-color: currentColor;
  flex-shrink: 0;
}

.subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

.subtitle-small {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
}

/* Loading */
.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Config Content */
.config-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.config-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.section-header h2 svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #667eea;
  flex-shrink: 0;
}

/* Configuración General */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.config-item {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-label span {
  flex: 1;
}

.help-text {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.5rem 0 0 2rem;
}

.time-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-item label {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.time-input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.time-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Botones */
.btn-save,
.btn-add,
.btn-delete,
.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save svg,
.btn-add svg,
.btn-delete svg,
.btn-create svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Horarios Semanales */
.schedules-table {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.schedule-row {
  display: grid;
  grid-template-columns: 120px 120px 1fr;
  align-items: center;
  min-height: 60px;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  transition: background 0.2s;
}

.schedule-row:last-child {
  border-bottom: none;
}

.schedule-row:hover {
  background: #f8fafc;
}

.day-name-col {
  padding: 1rem;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9375rem;
  border-right: 1px solid #e2e8f0;
}

.closed-col {
  padding: 1rem;
  border-right: 1px solid #e2e8f0;
}

.checkbox-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
  user-select: none;
}

.checkbox-inline input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-inline span {
  font-weight: 500;
}

.schedules-col {
  padding: 1rem;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.time-slot-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
}

.slot-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  min-width: 65px;
}

.time-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 110px;
  transition: all 0.2s;
  font-family: inherit;
}

.time-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-remove {
  padding: 0.25rem 0.5rem;
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #ef4444;
  color: white;
}

.btn-add-time {
  padding: 0.5rem 1rem;
  background: transparent;
  color: #667eea;
  border: 1px dashed #667eea;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}

.btn-add-time:hover {
  background: #667eea;
  color: white;
  border-style: solid;
}

.closed-text {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.875rem;
}

/* Selector de modo */
.mode-selector {
  background: white;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.mode-selector-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4338ca;
  margin: 0 0 1rem 0;
}

.mode-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.mode-option {
  position: relative;
  cursor: pointer;
  border: 2px solid #c7d2fe;
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.2s;
  background: white;
}

.mode-option:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.mode-option.active {
  border-color: #6366f1;
  background: linear-gradient(135deg, #f8f9ff 0%, #f3f4ff 100%);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.mode-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.mode-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mode-content svg {
  color: #6366f1;
  flex-shrink: 0;
}

.mode-option.active .mode-content svg {
  color: #4f46e5;
}

.mode-content > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mode-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
}

.mode-option.active .mode-title {
  color: #4338ca;
}

.mode-description {
  font-size: 0.75rem;
  color: #64748b;
}

.mode-option.active .mode-description {
  color: #6366f1;
}

/* Aplicación rápida de horarios */
.quick-schedule-box {
  background: linear-gradient(135deg, #f8f9ff 0%, #f3f4ff 100%);
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.quick-schedule-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.quick-schedule-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #4338ca;
}

.quick-schedule-subtitle {
  color: #6366f1;
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
}

/* Contenedor de configuraciones */
.quick-configs-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Cada fila de configuración */
.quick-config-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid #c7d2fe;
  border-radius: 10px;
  flex-wrap: wrap;
}

/* Sección de días */
.config-days-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 300px;
}

.config-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6366f1;
}

.quick-select-inline {
  padding: 0.5rem 0.75rem;
  border: 2px solid #c7d2fe;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  background: white;
  transition: all 0.2s;
  font-family: inherit;
  cursor: pointer;
  min-width: 110px;
}

.quick-select-inline:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.config-arrow {
  font-size: 1.5rem;
  color: #6366f1;
  font-weight: 700;
}

/* Sección de turnos (horizontal) */
.config-shifts-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  flex-wrap: wrap;
}

.config-shift-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.shift-separator {
  font-size: 1rem;
  font-weight: 700;
  color: #6366f1;
  margin: 0 0.25rem;
}

.shift-time-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border: 1px solid #e0e7ff;
  border-radius: 8px;
}

.time-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.time-input-inline {
  padding: 0.375rem 0.5rem;
  border: 1px solid #c7d2fe;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  background: white;
  transition: all 0.2s;
  font-family: inherit;
  width: 90px;
}

.time-input-inline:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.btn-remove-shift-inline {
  padding: 0.25rem;
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove-shift-inline:hover {
  background: #ef4444;
  color: white;
}

.btn-add-turno {
  padding: 0.375rem 0.75rem;
  background: transparent;
  color: #6366f1;
  border: 1px dashed #6366f1;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-add-turno:hover {
  background: #eef2ff;
  border-style: solid;
}

.btn-remove-config {
  padding: 0.375rem;
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.btn-remove-config:hover {
  background: #ef4444;
  color: white;
}

/* Botones de acción inferiores */
.quick-actions-bottom {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 2px solid #e0e7ff;
}

.btn-add-config {
  padding: 0.625rem 1.25rem;
  background: white;
  color: #6366f1;
  border: 2px solid #6366f1;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add-config:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-apply-all {
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  margin-left: auto;
}

.btn-apply-all:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-apply-all:active {
  transform: translateY(0);
}

/* Bloqueos */
.btn-add {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
}

.empty-state p {
  margin: 0.5rem 0;
}

.blocks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.block-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 12px;
}

.block-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.block-date {
  font-weight: 700;
  color: #991b1b;
  font-size: 1rem;
}

.block-date svg,
.block-time svg,
.block-reason svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.block-time {
  color: #dc2626;
  font-size: 0.875rem;
}

.block-reason {
  color: #64748b;
  font-size: 0.875rem;
  font-style: italic;
}

.btn-delete {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-delete:hover {
  background: #dc2626;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-create {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-create:hover {
  transform: translateY(-2px);
}

/* Advertencia de solapamiento */
.overlap-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  color: #92400e;
  font-size: 0.875rem;
  font-weight: 600;
}

.overlap-warning svg {
  color: #f59e0b;
  flex-shrink: 0;
}

/* Sistema de notificaciones toast */
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast:hover {
  transform: translateX(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.toast-success {
  border-left-color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-message {
  flex: 1;
  margin: 0;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toast-close:hover {
  background: #f1f5f9;
  color: #1e293b;
}

/* Modal de confirmación */
.confirm-modal {
  max-width: 500px;
}

.confirm-message {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  white-space: pre-line;
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.btn-confirm {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Tabs */
.tabs-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow-x: auto;
  flex-wrap: wrap;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button svg {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.tab-button:hover {
  background: #f8fafc;
  color: #1e293b;
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Información del Salón */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-group.span-2 {
  grid-column: span 2;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.info-label svg {
  width: 1rem;
  height: 1rem;
  color: #667eea;
  flex-shrink: 0;
}

.info-input,
.info-textarea {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  transition: all 0.2s;
  width: 100%;
}

.info-input:focus,
.info-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.info-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Dividers */
.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 2rem 0;
}

/* Coming Soon States */
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f8f9ff 0%, #f3f4ff 100%);
  border-radius: 12px;
  border: 2px dashed #c7d2fe;
}

.coming-soon svg {
  color: #a5b4fc;
  margin-bottom: 1rem;
}

.coming-soon h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #4338ca;
}

.coming-soon p {
  margin: 0;
  color: #6366f1;
  font-size: 0.9375rem;
}

@media (max-width: 768px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }

  .tabs-container {
    overflow-x: auto;
    flex-wrap: nowrap;
    gap: 0.25rem;
  }

  .tab-button {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-group.span-2 {
    grid-column: span 1;
  }
  
  .schedule-row {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  
  .day-name-col,
  .closed-col {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .time-slot-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .slot-label {
    min-width: auto;
  }
  
  .time-input {
    width: 100%;
  }
  
  .btn-add-time {
    width: 100%;
  }
  
  .block-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .btn-delete {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
