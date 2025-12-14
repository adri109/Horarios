<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { usePermissions } from '../../composables/usePermissions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Verificar permisos
usePermissions('canViewReports');

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
        <h1 class="title flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          Informes y Estadísticas
        </h1>
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
        <h2 class="section-title flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
          Filtros
        </h2>
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
            <span class="stat-icon-large">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p class="stat-value-large">{{ stats.totalRevenue.toFixed(2) }}€</p>
          <p class="stat-subtitle">Promedio: {{ stats.avgRevenue.toFixed(2) }}€</p>
        </div>

        <!-- Citas completadas -->
        <div class="stat-card-large stat-blue">
          <div class="stat-header">
            <span class="stat-label-large">Citas Completadas</span>
            <span class="stat-icon-large">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p class="stat-value-large">{{ stats.completedAppointments }}</p>
          <p class="stat-subtitle">Tasa: {{ stats.completionRate }}%</p>
        </div>

        <!-- Total citas -->
        <div class="stat-card-large stat-purple">
          <div class="stat-header">
            <span class="stat-label-large">Total Citas</span>
            <span class="stat-icon-large">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </span>
          </div>
          <p class="stat-value-large">{{ stats.totalAppointments }}</p>
          <p class="stat-subtitle">Pendientes: {{ stats.pendingAppointments }}</p>
        </div>

        <!-- Citas canceladas -->
        <div class="stat-card-large stat-red">
          <div class="stat-header">
            <span class="stat-label-large">Citas Canceladas</span>
            <span class="stat-icon-large">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p class="stat-value-large">{{ stats.cancelledAppointments }}</p>
          <p class="stat-subtitle">Tasa: {{ stats.cancellationRate }}%</p>
        </div>
      </div>

      <!-- Servicios más populares -->
      <div class="grid-two-cols">
        <div class="info-card">
          <div class="card-header">
            <h2 class="card-title flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              Servicios Más Populares
            </h2>
            <button 
              @click="exportPopularServices" 
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              CSV
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
            <h2 class="card-title flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              Ingresos por Servicio
            </h2>
            <button 
              @click="exportRevenueByService" 
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              CSV
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
          <h2 class="card-title flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Clientes Más Frecuentes
          </h2>
          <button 
            @click="exportTopClients" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            CSV
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
      <div class="info-card" style="margin-top: 1.5rem;">
        <h2 class="card-title mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          </svg>
          Exportar Datos
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            @click="exportAppointments" 
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Exportar Todas las Citas
          </button>
          <button 
            @click="exportStats" 
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Exportar Estadísticas Generales
          </button>
          <button 
            @click="loadData" 
            class="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Recargar Datos
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

.title svg {
  color: #667eea;
  background: none;
  -webkit-text-fill-color: currentColor;
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
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
}

.stat-icon-large svg {
  width: 1.75rem;
  height: 1.75rem;
  color: white;
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

/* Iconos de secciones */
.card-title svg,
.section-title svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #667eea;
  flex-shrink: 0;
}

/* Iconos de botones */
.info-card button svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
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
