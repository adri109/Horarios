<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Estado
const appointments = ref([]);
const clients = ref([]);
const services = ref([]);
const loading = ref(true);
const selectedPeriod = ref('month'); // week, month, year, all

// Fechas para filtros
const startDate = ref('');
const endDate = ref('');

// Cargar datos
const loadData = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [appointmentsRes, clientsRes, servicesRes] = await Promise.all([
      axios.get(`${API_URL}/appointments`, { headers }),
      axios.get(`${API_URL}/clients`, { headers }),
      axios.get(`${API_URL}/services`, { headers })
    ]);

    appointments.value = appointmentsRes.data;
    clients.value = clientsRes.data;
    services.value = servicesRes.data;
  } catch (error) {
    console.error('Error cargando datos:', error);
    alert('Error al cargar los datos');
  } finally {
    loading.value = false;
  }
};

// Filtrar citas por período
const filteredAppointments = computed(() => {
  let filtered = appointments.value;
  const now = new Date();
  
  if (selectedPeriod.value === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(a => new Date(a.startTime) >= weekAgo);
  } else if (selectedPeriod.value === 'month') {
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    filtered = filtered.filter(a => new Date(a.startTime) >= monthAgo);
  } else if (selectedPeriod.value === 'year') {
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    filtered = filtered.filter(a => new Date(a.startTime) >= yearAgo);
  }

  // Filtro por fechas personalizadas
  if (startDate.value) {
    filtered = filtered.filter(a => new Date(a.startTime) >= new Date(startDate.value));
  }
  if (endDate.value) {
    filtered = filtered.filter(a => new Date(a.startTime) <= new Date(endDate.value));
  }

  return filtered;
});

// Estadísticas calculadas
const stats = computed(() => {
  const completed = filteredAppointments.value.filter(a => a.status === 'COMPLETED');
  const cancelled = filteredAppointments.value.filter(a => a.status === 'CANCELLED');
  const pending = filteredAppointments.value.filter(a => a.status === 'PENDING');
  
  const totalRevenue = completed.reduce((sum, a) => sum + (a.service?.price || 0), 0);
  const avgRevenue = completed.length > 0 ? totalRevenue / completed.length : 0;

  return {
    totalAppointments: filteredAppointments.value.length,
    completedAppointments: completed.length,
    cancelledAppointments: cancelled.length,
    pendingAppointments: pending.length,
    totalRevenue,
    avgRevenue,
    totalClients: clients.value.length,
    totalServices: services.value.length,
    completionRate: filteredAppointments.value.length > 0 
      ? (completed.length / filteredAppointments.value.length * 100).toFixed(1)
      : 0,
    cancellationRate: filteredAppointments.value.length > 0
      ? (cancelled.length / filteredAppointments.value.length * 100).toFixed(1)
      : 0
  };
});

// Servicios más populares
const popularServices = computed(() => {
  const serviceCount = {};
  filteredAppointments.value
    .filter(a => a.status === 'COMPLETED')
    .forEach(a => {
      const serviceName = a.service?.name || 'Sin servicio';
      serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
    });
  
  return Object.entries(serviceCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
});

// Ingresos por servicio
const revenueByService = computed(() => {
  const serviceRevenue = {};
  filteredAppointments.value
    .filter(a => a.status === 'COMPLETED')
    .forEach(a => {
      const serviceName = a.service?.name || 'Sin servicio';
      const price = a.service?.price || 0;
      serviceRevenue[serviceName] = (serviceRevenue[serviceName] || 0) + price;
    });
  
  return Object.entries(serviceRevenue)
    .sort(([, a], [, b]) => b - a)
    .map(([name, revenue]) => ({ name, revenue }));
});

// Clientes más frecuentes
const topClients = computed(() => {
  const clientCount = {};
  filteredAppointments.value.forEach(a => {
    const clientName = a.client?.name || 'Cliente desconocido';
    clientCount[clientName] = (clientCount[clientName] || 0) + 1;
  });
  
  return Object.entries(clientCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
});

// Función para descargar CSV
const downloadCSV = (data, filename) => {
  if (data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // Escapar comas y comillas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar citas
const exportAppointments = () => {
  const data = filteredAppointments.value.map(a => ({
    Fecha: new Date(a.startTime).toLocaleDateString('es-ES'),
    Hora: new Date(a.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    Cliente: a.client?.name || 'N/A',
    Servicio: a.service?.name || 'N/A',
    Precio: a.service?.price || 0,
    Estado: a.status,
    Duración: `${a.service?.duration || 0} min`
  }));
  downloadCSV(data, 'citas');
};

// Exportar estadísticas generales
const exportStats = () => {
  const data = [{
    Período: selectedPeriod.value === 'week' ? 'Última semana' : 
             selectedPeriod.value === 'month' ? 'Último mes' :
             selectedPeriod.value === 'year' ? 'Último año' : 'Todos',
    'Total Citas': stats.value.totalAppointments,
    'Citas Completadas': stats.value.completedAppointments,
    'Citas Canceladas': stats.value.cancelledAppointments,
    'Citas Pendientes': stats.value.pendingAppointments,
    'Ingresos Totales': `${stats.value.totalRevenue.toFixed(2)}€`,
    'Ingreso Promedio': `${stats.value.avgRevenue.toFixed(2)}€`,
    'Tasa Completado': `${stats.value.completionRate}%`,
    'Tasa Cancelación': `${stats.value.cancellationRate}%`,
    'Total Clientes': stats.value.totalClients,
    'Total Servicios': stats.value.totalServices
  }];
  downloadCSV(data, 'estadisticas_generales');
};

// Exportar servicios populares
const exportPopularServices = () => {
  const data = popularServices.value.map(s => ({
    Servicio: s.name,
    'Número de Citas': s.count
  }));
  downloadCSV(data, 'servicios_populares');
};

// Exportar ingresos por servicio
const exportRevenueByService = () => {
  const data = revenueByService.value.map(s => ({
    Servicio: s.name,
    'Ingresos Totales': `${s.revenue.toFixed(2)}€`
  }));
  downloadCSV(data, 'ingresos_por_servicio');
};

// Exportar clientes frecuentes
const exportTopClients = () => {
  const data = topClients.value.map(c => ({
    Cliente: c.name,
    'Número de Citas': c.count
  }));
  downloadCSV(data, 'clientes_frecuentes');
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="informes-container">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="title">📊 Informes y Estadísticas</h1>
        <p class="subtitle">Análisis detallado del rendimiento de tu salón</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>

    <div v-else>
      <!-- Filtros -->
      <div class="filters-section">
        <h2 class="section-title">🔍 Filtros</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Período predefinido -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select 
              v-model="selectedPeriod" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="year">Último año</option>
              <option value="all">Todos</option>
            </select>
          </div>

          <!-- Fecha inicio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha inicio</label>
            <input 
              v-model="startDate" 
              type="date" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <!-- Fecha fin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha fin</label>
            <input 
              v-model="endDate" 
              type="date" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <!-- Botón limpiar -->
          <div class="flex items-end">
            <button 
              @click="startDate = ''; endDate = ''; selectedPeriod = 'month'" 
              class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas principales -->
      <div class="stats-grid-large">
        <!-- Ingresos totales -->
        <div class="stat-card-large stat-green">
          <div class="stat-header">
            <span class="stat-label-large">Ingresos Totales</span>
            <span class="stat-icon-large">💰</span>
          </div>
          <p class="stat-value-large">{{ stats.totalRevenue.toFixed(2) }}€</p>
          <p class="stat-subtitle">Promedio: {{ stats.avgRevenue.toFixed(2) }}€</p>
        </div>

        <!-- Citas completadas -->
        <div class="stat-card-large stat-blue">
          <div class="stat-header">
            <span class="stat-label-large">Citas Completadas</span>
            <span class="stat-icon-large">✅</span>
          </div>
          <p class="stat-value-large">{{ stats.completedAppointments }}</p>
          <p class="stat-subtitle">Tasa: {{ stats.completionRate }}%</p>
        </div>

        <!-- Total citas -->
        <div class="stat-card-large stat-purple">
          <div class="stat-header">
            <span class="stat-label-large">Total Citas</span>
            <span class="stat-icon-large">📅</span>
          </div>
          <p class="stat-value-large">{{ stats.totalAppointments }}</p>
          <p class="stat-subtitle">Pendientes: {{ stats.pendingAppointments }}</p>
        </div>

        <!-- Citas canceladas -->
        <div class="stat-card-large stat-red">
          <div class="stat-header">
            <span class="stat-label-large">Citas Canceladas</span>
            <span class="stat-icon-large">❌</span>
          </div>
          <p class="stat-value-large">{{ stats.cancelledAppointments }}</p>
          <p class="stat-subtitle">Tasa: {{ stats.cancellationRate }}%</p>
        </div>
      </div>

      <!-- Servicios más populares -->
      <div class="grid-two-cols">
        <div class="info-card">
          <div class="card-header">
            <h2 class="card-title">⭐ Servicios Más Populares</h2>
            <button 
              @click="exportPopularServices" 
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              📥 CSV
            </button>
          </div>
          <div v-if="popularServices.length > 0" class="space-y-3">
            <div 
              v-for="(service, index) in popularServices" 
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl font-bold text-purple-600">{{ index + 1 }}</span>
                <span class="font-medium text-gray-800">{{ service.name }}</span>
              </div>
              <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                {{ service.count }} citas
              </span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-8">No hay datos disponibles</p>
        </div>

        <!-- Ingresos por servicio -->
        <div class="info-card">
          <div class="card-header">
            <h2 class="card-title">💵 Ingresos por Servicio</h2>
            <button 
              @click="exportRevenueByService" 
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            >
              📥 CSV
            </button>
          </div>
          <div v-if="revenueByService.length > 0" class="space-y-3">
            <div 
              v-for="(service, index) in revenueByService.slice(0, 5)" 
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span class="font-medium text-gray-800">{{ service.name }}</span>
              <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {{ service.revenue.toFixed(2) }}€
              </span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-8">No hay datos disponibles</p>
        </div>
      </div>

      <!-- Clientes más frecuentes -->
      <div class="info-card">
        <div class="card-header">
          <h2 class="card-title">👥 Clientes Más Frecuentes</h2>
          <button 
            @click="exportTopClients" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            📥 CSV
          </button>
        </div>
        <div v-if="topClients.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div 
            v-for="(client, index) in topClients" 
            :key="index"
            class="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg font-bold text-blue-600">{{ index + 1 }}.</span>
              <span class="font-medium text-gray-800 truncate">{{ client.name }}</span>
            </div>
            <span class="text-sm text-gray-600">{{ client.count }} citas</span>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>

      <!-- Botones de exportación global -->
      <div class="info-card">
        <h2 class="card-title mb-4">📁 Exportar Datos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            @click="exportAppointments" 
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            📥 Exportar Todas las Citas
          </button>
          <button 
            @click="exportStats" 
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            📊 Exportar Estadísticas Generales
          </button>
          <button 
            @click="loadData" 
            class="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            🔄 Recargar Datos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.informes-container {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.header {
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.filters-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.filters-section .grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filters-section label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.filters-section input,
.filters-section select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.filters-section input:focus,
.filters-section select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filters-section button {
  padding: 0.75rem 1rem;
  background: #e5e7eb;
  color: #374151;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.filters-section button:hover {
  background: #d1d5db;
}

.stats-grid-large {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card-large {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid;
}

.stat-card-large:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.stat-green {
  border-color: #10b981;
}

.stat-blue {
  border-color: #3b82f6;
}

.stat-purple {
  border-color: #8b5cf6;
}

.stat-red {
  border-color: #ef4444;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-label-large {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-icon-large {
  font-size: 1.5rem;
}

.stat-value-large {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.stat-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.grid-two-cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.info-card button {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.info-card button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.info-card .space-y-3 > div {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-card .space-y-3 > div span:first-child {
  font-weight: 500;
  color: #374151;
}

.info-card .space-y-3 > div span:last-child {
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.info-card .grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.info-card .grid > div {
  padding: 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 0.5rem;
  border: 1px solid #bae6fd;
}

.info-card .grid > div .flex {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.info-card .grid > div .flex span:first-child {
  font-size: 1.125rem;
  font-weight: bold;
  color: #0284c7;
}

.info-card .grid > div .flex span:last-child {
  font-weight: 500;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-card .grid > div .text-sm {
  font-size: 0.875rem;
  color: #6b7280;
}

.info-card .grid-cols-3 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.info-card .grid-cols-3 button {
  padding: 1rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.info-card .grid-cols-3 button:first-child {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.info-card .grid-cols-3 button:nth-child(2) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.info-card .grid-cols-3 button:nth-child(3) {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.info-card .grid-cols-3 button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.text-gray-500 {
  color: #6b7280;
}

.text-center {
  text-align: center;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .grid-two-cols {
    grid-template-columns: 1fr;
  }
  
  .stats-grid-large {
    grid-template-columns: 1fr;
  }
}
</style>
