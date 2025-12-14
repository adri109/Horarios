<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000';
const router = useRouter();

// Solo admin puede acceder a configuración
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.role !== 'ADMIN') {
  router.push('/dashboard/resume');
}

const loading = ref(true);
const saving = ref(false);

// Configuración general
const config = ref({
  requireConfirmation: false,
  workersCanCreateServices: false,
  canAcceptAppointments: true,
  canModifyAppointments: true,
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
    
    console.log('✅ Configuración recibida:', response.data);
    
    if (response.data.config) {
      config.value = response.data.config;
    }
    
    schedules.value = response.data.schedules || [];
    blocks.value = response.data.blocks || [];
    
  } catch (error) {
    console.error('❌ Error cargando configuración:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  } finally {
    loading.value = false;
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
    
    alert('✅ Configuración guardada correctamente');
  } catch (error) {
    console.error('❌ Error guardando configuración:', error);
    alert('Error al guardar la configuración');
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
    
    // Si hay horarios existentes, el nuevo debe empezar después del último
    let newOpeningTime = config.value.openingTime;
    let newClosingTime = config.value.closingTime;
    
    if (existingSchedules.length > 0) {
      // Ordenar por hora de cierre y tomar el último
      const sortedSchedules = [...existingSchedules].sort((a, b) => 
        a.closingTime.localeCompare(b.closingTime)
      );
      const lastSchedule = sortedSchedules[sortedSchedules.length - 1];
      
      // El nuevo horario empieza donde termina el último
      newOpeningTime = lastSchedule.closingTime;
      
      // Calcular hora de cierre (2 horas después por defecto)
      const [hours, minutes] = newOpeningTime.split(':').map(Number);
      const closingHours = hours + 2;
      newClosingTime = `${String(closingHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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
    alert('✅ Horario añadido correctamente');
  } catch (error) {
    console.error('❌ Error añadiendo horario:', error);
    alert('Error al añadir el horario');
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
    
    alert('✅ Horario actualizado correctamente');
  } catch (error) {
    console.error('❌ Error actualizando horario:', error);
    alert('Error al actualizar el horario');
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
    alert('✅ Horario eliminado correctamente');
  } catch (error) {
    console.error('❌ Error eliminando horario:', error);
    alert('Error al eliminar el horario');
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
    
    alert('✅ Estado actualizado correctamente');
  } catch (error) {
    console.error('❌ Error actualizando estado:', error);
    alert('Error al actualizar el estado');
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
      alert('Por favor selecciona una fecha');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_URL}/config/blocks`, newBlock.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    blocks.value.push(response.data);
    showBlockModal.value = false;
    alert('✅ Bloqueo creado correctamente');
  } catch (error) {
    console.error('❌ Error creando bloqueo:', error);
    alert('Error al crear el bloqueo');
  }
};

// Eliminar bloqueo
const deleteBlock = async (blockId) => {
  if (!confirm('¿Estás seguro de eliminar este bloqueo?')) return;
  
  try {
    const token = localStorage.getItem('token');
    
    await axios.delete(`${API_URL}/config/blocks/${blockId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    blocks.value = blocks.value.filter(b => b.id !== blockId);
    alert('✅ Bloqueo eliminado correctamente');
  } catch (error) {
    console.error('❌ Error eliminando bloqueo:', error);
    alert('Error al eliminar el bloqueo');
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
      
      <!-- CONFIGURACIÓN GENERAL -->
      <section class="config-section">
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
              <input type="checkbox" v-model="config.requireConfirmation" />
              <span>Requerir confirmación de citas</span>
            </label>
            <p class="help-text">Los clientes deben confirmar sus citas antes de que sean válidas</p>
          </div>
          
          <div class="config-item">
            <label class="checkbox-label">
              <input type="checkbox" v-model="config.workersCanCreateServices" />
              <span>Trabajadores pueden crear servicios</span>
            </label>
            <p class="help-text">Permite a los trabajadores añadir nuevos servicios</p>
          </div>
          
          <div class="config-item">
            <label class="checkbox-label">
              <input type="checkbox" v-model="config.canAcceptAppointments" />
              <span>Aceptar citas online</span>
            </label>
            <p class="help-text">Los clientes pueden reservar citas desde la web pública</p>
          </div>
          
          <div class="config-item">
            <label class="checkbox-label">
              <input type="checkbox" v-model="config.canModifyAppointments" />
              <span>Clientes pueden modificar citas</span>
            </label>
            <p class="help-text">Permite a los clientes cancelar o reprogramar citas</p>
          </div>
        </div>

        <div class="time-config">
          <div class="time-item">
            <label>Intervalo de servicios (minutos)</label>
            <input type="number" v-model="config.serviceIntervalMinutes" min="5" max="120" class="time-input" />
          </div>
        </div>
      </section>

      <!-- HORARIOS SEMANALES -->
      <section class="config-section">
        <div class="section-header">
          <h2 class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Horarios por Día de la Semana
          </h2>
          <p class="subtitle-small">Configura horarios específicos para cada día. Puedes añadir turnos partidos.</p>
        </div>
        
        <div class="schedules-table">
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
        </div>
      </section>

      <!-- BLOQUEOS DE FECHAS -->
      <section class="config-section">
        <div class="section-header">
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

@media (max-width: 768px) {
  .config-container {
    padding: 1rem;
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
