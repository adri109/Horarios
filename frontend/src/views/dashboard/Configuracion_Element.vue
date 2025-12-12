<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

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
      <h1 class="title">⚙️ Configuración</h1>
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
          <h2>🎯 Configuración General</h2>
          <button @click="saveConfig" :disabled="saving" class="btn-save">
            {{ saving ? 'Guardando...' : '💾 Guardar' }}
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
          <h2>📅 Horarios por Día de la Semana</h2>
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
          <h2>🚫 Bloqueos de Fechas</h2>
          <button @click="openBlockModal" class="btn-add">
            ➕ Nuevo Bloqueo
          </button>
        </div>
        
        <div v-if="blocks.length === 0" class="empty-state">
          <p>No hay bloqueos configurados</p>
          <p class="help-text">Los bloqueos impiden que se reserven citas en fechas específicas</p>
        </div>
        
        <div v-else class="blocks-list">
          <div v-for="block in blocks" :key="block.id" class="block-item">
            <div class="block-info">
              <div class="block-date">📅 {{ formatDate(block.date) }}</div>
              <div class="block-time">🕐 {{ block.startTime }} - {{ block.endTime }}</div>
              <div v-if="block.reason" class="block-reason">💬 {{ block.reason }}</div>
            </div>
            <button @click="deleteBlock(block.id)" class="btn-delete">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- MODAL NUEVO BLOQUEO -->
    <div v-if="showBlockModal" class="modal-overlay" @click="showBlockModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>➕ Nuevo Bloqueo</h2>
          <button @click="showBlockModal = false" class="close-btn">✕</button>
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
  background: #10b981;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-add:hover {
  transform: translateY(-2px);
  background: #059669;
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
  font-size: 1.5rem;
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
