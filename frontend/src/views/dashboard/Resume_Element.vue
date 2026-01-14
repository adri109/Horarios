<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import axios from '@/utils/axios';
import { useSocket } from '@/composables/useSocket';

const { on, off } = useSocket();

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
const stats = ref(null);
const loading = ref(true);

// Cargar estadísticas
const fetchStats = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No autenticado');
      window.location.href = '/login';
      return;
    }
    
    const response = await axios.get(`${API_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    stats.value = response.data;
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.error('❌ Sesión expirada');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  } finally {
    loading.value = false;
  }
};

// Marcar cita como completada o no show
const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const token = localStorage.getItem('token');
    
    await axios.put(
      `${API_URL}/dashboard/appointments/${appointmentId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // Recargar estadísticas
    await fetchStats();
  } catch (error) {
    console.error('Error actualizando cita:', error);
  }
};

// Formatear fecha/hora
const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

// Calcular progreso del día (basado en ingresos)
const dailyProgress = computed(() => {
  if (!stats.value) return 0;
  const target = 200; // Meta diaria de ejemplo: 200€
  return Math.min((stats.value.today.revenue / target) * 100, 100);
});

// Listener para actualizar stats cuando haya cambios
const handleDataUpdate = (data) => {
  console.log('🔄 Actualizando estadísticas...', data);
  fetchStats();
};

onMounted(() => {
  fetchStats();
  
  // Escuchar eventos de actualización
  on('appointment-created', handleDataUpdate);
  on('appointment-updated', handleDataUpdate);
  on('appointment-cancelled', handleDataUpdate);
});

onBeforeUnmount(() => {
  off('appointment-created', handleDataUpdate);
  off('appointment-updated', handleDataUpdate);
  off('appointment-cancelled', handleDataUpdate);
});
</script>

<template>
  <div class="dashboard-container">
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando dashboard...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="stats" class="dashboard-content">
      <!-- Header -->
      <div class="dashboard-header">
        <div>
          <h1 class="title">Dashboard</h1>
          <p class="subtitle">Vista general de tu salón</p>
        </div>
        <div class="current-time">
          <span class="time-label">{{ new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span>
        </div>
      </div>

      <!-- Cita Actual / Próxima -->
      <div class="current-appointment-section">
        <!-- Cita Actual -->
        <div v-if="stats.currentAppointment" class="current-appointment active">
          <div class="appointment-header">
            <span class="status-badge active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="badge-icon">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              EN CURSO
            </span>
            <span class="appointment-time">{{ formatTime(stats.currentAppointment.startTime) }} - {{ formatTime(stats.currentAppointment.endTime) }}</span>
          </div>
          <div class="appointment-body">
            <div class="client-info">
              <div class="avatar">{{ stats.currentAppointment.client.name.charAt(0).toUpperCase() }}</div>
              <div>
                <h3>{{ stats.currentAppointment.client.name }}</h3>
                <p class="service-name">{{ stats.currentAppointment.service.name }}</p>
                <p class="phone">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="phone-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  {{ stats.currentAppointment.client.phone }}
                </p>
              </div>
            </div>
            <div class="appointment-actions">
              <button @click="updateAppointmentStatus(stats.currentAppointment.id, 'COMPLETED')" class="btn-complete">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Completar
              </button>
              <button @click="updateAppointmentStatus(stats.currentAppointment.id, 'CANCELLED')" class="btn-cancel">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                No vino
              </button>
            </div>
          </div>
        </div>

        <!-- Próxima Cita -->
        <div v-else-if="stats.nextAppointment" class="current-appointment next">
          <div class="appointment-header">
            <span class="status-badge next">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="badge-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              PRÓXIMA
            </span>
            <span class="appointment-time">{{ formatTime(stats.nextAppointment.startTime) }} - {{ formatTime(stats.nextAppointment.endTime) }}</span>
          </div>
          <div class="appointment-body">
            <div class="client-info">
              <div class="avatar">{{ stats.nextAppointment.client.name.charAt(0).toUpperCase() }}</div>
              <div>
                <h3>{{ stats.nextAppointment.client.name }}</h3>
                <p class="service-name">{{ stats.nextAppointment.service.name }}</p>
                <p class="phone">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="phone-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  {{ stats.nextAppointment.client.phone }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin citas -->
        <div v-else class="current-appointment empty">
          <div class="empty-state-small">
            <span class="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </span>
            <p>No hay citas programadas ahora</p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <!-- Ingresos Hoy -->
        <div class="stat-card highlight">
          <div class="stat-header">
            <span class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h3>Ingresos Hoy</h3>
          </div>
          <p class="stat-value">{{ formatPrice(stats.today.revenue) }}</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: dailyProgress + '%' }"></div>
          </div>
          <p class="stat-label">{{ dailyProgress.toFixed(0) }}% del objetivo diario</p>
        </div>

        <!-- Citas Hoy -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </span>
            <h3>Citas Hoy</h3>
          </div>
          <p class="stat-value">{{ stats.today.appointments }}</p>
          <div class="mini-stats">
            <span class="mini-stat success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="mini-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {{ stats.today.completed }}
            </span>
            <span class="mini-stat pending">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mini-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ stats.today.pending }}
            </span>
            <span class="mini-stat cancelled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="mini-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ stats.today.cancelled }}
            </span>
          </div>
        </div>

        <!-- Nuevos Clientes Hoy -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
            <h3>Nuevos Hoy</h3>
          </div>
          <p class="stat-value">{{ stats.today.newClients }}</p>
          <p class="stat-label">clientes nuevos</p>
        </div>

        <!-- Ingresos del Mes -->
        <div class="stat-card highlight">
          <div class="stat-header">
            <span class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </span>
            <h3>Ingresos del Mes</h3>
          </div>
          <p class="stat-value">{{ formatPrice(stats.month.revenue) }}</p>
          <p class="stat-label">Total acumulado</p>
        </div>

        <!-- Nuevos Clientes Semana -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </span>
            <h3>Nuevos (7 días)</h3>
          </div>
          <p class="stat-value">{{ stats.week.newClients }}</p>
          <p class="stat-label">esta semana</p>
        </div>

        <!-- Nuevos Clientes Mes -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </span>
            <h3>Nuevos (mes)</h3>
          </div>
          <p class="stat-value">{{ stats.month.newClients }}</p>
          <p class="stat-label">este mes</p>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="charts-grid">
        <!-- Ingresos últimos 7 días -->
        <div class="chart-card">
          <h3>Ingresos de los últimos 7 días</h3>
          <div class="bar-chart">
            <div v-for="day in stats.charts.last7Days" :key="day.date" class="bar-container">
              <div class="bar-wrapper">
                <div 
                  class="bar" 
                  :style="{ height: (day.revenue / Math.max(...stats.charts.last7Days.map(d => d.revenue))) * 100 + '%' }"
                  :title="formatPrice(day.revenue)"
                ></div>
              </div>
              <span class="bar-label">{{ new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' }) }}</span>
              <span class="bar-value">{{ formatPrice(day.revenue) }}</span>
            </div>
          </div>
        </div>

        <!-- Servicios más populares -->
        <div class="chart-card">
          <h3>Servicios más populares (este mes)</h3>
          <div class="services-list">
            <div v-for="(service, index) in stats.charts.topServices" :key="service.name" class="service-item">
              <div class="service-rank">{{ index + 1 }}</div>
              <div class="service-details">
                <p class="service-title">{{ service.name }}</p>
                <div class="service-bar">
                  <div 
                    class="service-bar-fill" 
                    :style="{ width: (service.count / stats.charts.topServices[0].count) * 100 + '%' }"
                  ></div>
                </div>
              </div>
              <div class="service-stats">
                <span class="service-count">{{ service.count }} citas</span>
                <span class="service-revenue">{{ formatPrice(service.revenue) }}</span>
              </div>
            </div>
            <div v-if="stats.charts.topServices.length === 0" class="empty-services">
              <p>No hay datos de servicios este mes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

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

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.current-time {
  text-align: right;
}

.time-label {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: capitalize;
}

/* Cita Actual/Próxima */
.current-appointment-section {
  margin-bottom: 2rem;
}

.current-appointment {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.current-appointment.active {
  border: 3px solid #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fff 50%);
}

.current-appointment.next {
  border: 3px solid #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #fff 50%);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.badge-icon {
  width: 1rem;
  height: 1rem;
}

.status-badge.active {
  background: #ef4444;
  color: white;
}

.status-badge.next {
  background: #3b82f6;
  color: white;
}

.appointment-time {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.appointment-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.client-info h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.service-name {
  color: #667eea;
  font-weight: 600;
  margin: 0.25rem 0;
}

.phone {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.phone-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.appointment-actions {
  display: flex;
  gap: 1rem;
}

.btn-complete, .btn-cancel {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.btn-complete {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-complete:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-cancel {
  background: #ef4444;
  color: white;
}

.btn-cancel:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.empty-state-small {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #cbd5e1;
  margin: 0 auto 0.5rem;
  display: block;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.stat-card.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
}

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.stat-header h3 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0.5rem 0 0 0;
}

.mini-stats {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.mini-stat {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.mini-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.mini-stat.success {
  background: #d1fae5;
  color: #065f46;
}

.mini-stat.pending {
  background: #fef3c7;
  color: #92400e;
}

.mini-stat.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.chart-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  height: 200px;
}

.bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar-wrapper {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 100%;
  max-width: 60px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.bar-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: capitalize;
}

.bar-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
}

/* Services List */
.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s;
}

.service-item:hover {
  background: #f1f5f9;
}

.service-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.service-details {
  flex: 1;
}

.service-title {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #1e293b;
}

.service-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.service-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.service-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.service-count {
  font-size: 0.875rem;
  color: #64748b;
}

.service-revenue {
  font-size: 1rem;
  font-weight: 700;
  color: #10b981;
}

.empty-services {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .appointment-body {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .appointment-actions {
    width: 100%;
  }
  
  .btn-complete, .btn-cancel {
    flex: 1;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .bar-chart {
    height: 180px;
  }
  
  .bar-wrapper {
    height: 120px;
  }
}
</style>
