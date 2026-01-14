<template>
  <div class="citas-container">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="title">Gestión de Citas</h1>
        <p class="subtitle">Administra las reservas de tu salón</p>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="stats-section">
      <!-- Selector de periodo -->
      <div class="stats-header">
        <h2 class="stats-title">Estadísticas</h2>
        <div class="period-selector">
          <button 
            :class="['period-btn', { active: statsPeriod === 'today' }]"
            @click="statsPeriod = 'today'"
          >
            Hoy
          </button>
          <button 
            :class="['period-btn', { active: statsPeriod === 'week' }]"
            @click="statsPeriod = 'week'"
          >
            Semana
          </button>
          <button 
            :class="['period-btn', { active: statsPeriod === 'month' }]"
            @click="statsPeriod = 'month'"
          >
            Mes
          </button>
          <button 
            :class="['period-btn', { active: statsPeriod === 'year' }]"
            @click="statsPeriod = 'year'"
          >
            Año
          </button>
        </div>
      </div>

      <!-- Tarjetas de estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats.total }}</p>
            <p class="stat-label">Total Citas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats.completadas }}</p>
            <p class="stat-label">Completadas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats.pendientes }}</p>
            <p class="stat-label">Pendientes</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats.canceladas }}</p>
            <p class="stat-label">Canceladas</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filters-container">
      <div class="search-box">
        <span class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar por cliente, servicio..."
          class="search-input"
        />
      </div>
      
      <div class="filter-buttons">
        <button 
          :class="['filter-btn', { active: viewMode === 'active' }]"
          @click="viewMode = 'active'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Activas
        </button>
        <button 
          :class="['filter-btn', { active: viewMode === 'archived' }]"
          @click="viewMode = 'archived'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          Archivadas
        </button>
      </div>

      <div v-if="viewMode === 'active'" class="filter-buttons">
        <button 
          :class="['filter-btn-small', { active: filterStatus === 'all' }]"
          @click="filterStatus = 'all'"
        >
          Todas
        </button>
        <button 
          :class="['filter-btn-small', { active: filterStatus === 'PENDING' }]"
          @click="filterStatus = 'PENDING'"
        >
          Pendientes
        </button>
        <button 
          :class="['filter-btn-small', { active: filterStatus === 'CONFIRMED' }]"
          @click="filterStatus = 'CONFIRMED'"
        >
          Confirmadas
        </button>
      </div>

      <div v-if="viewMode === 'active'" class="date-filter">
        <select v-model="dateFilter" class="date-select">
          <option value="all">Todas las fechas</option>
          <option value="today">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
        </select>
      </div>

      <div v-if="viewMode === 'archived'" class="date-filter">
        <select v-model="archivedDateFilter" class="date-select">
          <option value="all">Todo el historial</option>
          <option value="last-week">Última semana</option>
          <option value="last-month">Último mes</option>
          <option value="last-3-months">Últimos 3 meses</option>
          <option value="last-year">Último año</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando citas...</p>
    </div>

    <!-- Lista de citas -->
    <div v-else-if="filteredCitas.length > 0" class="citas-grid">
      <div 
        v-for="cita in filteredCitas" 
        :key="cita.id" 
        class="cita-card"
      >
        <div class="cita-header">
          <div class="client-info">
            <div class="client-avatar">{{ cita.client.name.charAt(0).toUpperCase() }}</div>
            <div>
              <h3 class="client-name">{{ cita.client.name }}</h3>
              <p class="client-phone">{{ cita.client.phone || 'Sin teléfono' }}</p>
            </div>
          </div>
          <div :class="['status-badge', getStatusClass(cita.status)]">
            {{ getStatusText(cita.status) }}
          </div>
        </div>

        <div class="cita-details">
          <div class="detail-row">
            <span class="detail-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </span>
            <span class="detail-text">{{ cita.service.name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
              </svg>
            </span>
            <span class="detail-text">{{ formatFecha(cita.startTime) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span class="detail-text">{{ formatHora(cita.startTime) }} - {{ formatHora(cita.endTime) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span class="detail-text">{{ formatPrice(cita.service.price) }}</span>
          </div>
        </div>

        <div class="cita-actions" v-if="viewMode === 'active'">
          <button 
            v-if="cita.status === 'PENDING'"
            @click="updateStatus(cita.id, 'CONFIRMED')"
            class="btn-confirm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Confirmar
          </button>
          <button 
            v-if="cita.status === 'CONFIRMED'"
            @click="updateStatus(cita.id, 'COMPLETED')"
            class="btn-complete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completar
          </button>
          <button 
            v-if="cita.status !== 'CANCELLED' && cita.status !== 'COMPLETED'"
            @click="updateStatus(cita.id, 'CANCELLED')"
            class="btn-cancel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
        </div>
        
        <div class="archived-info" v-if="viewMode === 'archived'">
          <p class="archived-date">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            Archivada: {{ formatFechaCorta(cita.endTime) }}
          </p>
          <button @click="showDetails(cita)" class="btn-details">
            Ver detalles
          </button>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
      </div>
      <p class="empty-title">No se encontraron citas</p>
      <p class="empty-subtitle">
        {{ searchQuery ? 'Intenta con otra búsqueda' : viewMode === 'archived' ? 'No hay citas archivadas' : 'Aún no tienes citas registradas' }}
      </p>
    </div>

    <!-- Modal de detalles -->
    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Detalles de la Cita</h2>
          <button @click="showDetailModal = false" class="close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedCita">
          <div class="detail-section">
            <h3>Información del Cliente</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Nombre:</span>
                <span class="info-value">{{ selectedCita.client.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Teléfono:</span>
                <span class="info-value">{{ selectedCita.client.phone || 'No registrado' }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Detalles del Servicio</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Servicio:</span>
                <span class="info-value">{{ selectedCita.service.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Duración:</span>
                <span class="info-value">{{ selectedCita.service.duration }} minutos</span>
              </div>
              <div class="info-item">
                <span class="info-label">Precio:</span>
                <span class="info-value">{{ formatPrice(selectedCita.service.price) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Estado:</span>
                <span :class="['info-badge', getStatusClass(selectedCita.status)]">
                  {{ getStatusText(selectedCita.status) }}
                </span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Fecha y Hora</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Fecha:</span>
                <span class="info-value">{{ formatFecha(selectedCita.startTime) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Hora inicio:</span>
                <span class="info-value">{{ formatHora(selectedCita.startTime) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Hora fin:</span>
                <span class="info-value">{{ formatHora(selectedCita.endTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import axios from '@/utils/axios';
import { useSocket } from '@/composables/useSocket';

const { on, off } = useSocket();

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

const loading = ref(true);
const citas = ref([]);
const searchQuery = ref('');
const filterStatus = ref('all');
const dateFilter = ref('all');
const viewMode = ref('active'); // 'active' o 'archived'
const archivedDateFilter = ref('all');
const showDetailModal = ref(false);
const selectedCita = ref(null);
const statsPeriod = ref('today'); // Periodo para las estadísticas: today, week, month, year

// Determinar si una cita está archivada
const isArchived = (cita) => {
  const citaDate = new Date(cita.endTime);
  const now = new Date();
  return (cita.status === 'COMPLETED' || cita.status === 'CANCELLED') && citaDate < now;
};

// Helper para filtrar citas por periodo
const filterByPeriod = (citas, period) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch(period) {
    case 'today': {
      const todayStr = now.toISOString().split('T')[0];
      return citas.filter(c => c.startTime.startsWith(todayStr));
    }
    case 'week': {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return citas.filter(c => new Date(c.startTime) >= weekAgo);
    }
    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return citas.filter(c => new Date(c.startTime) >= monthStart);
    }
    case 'year': {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return citas.filter(c => new Date(c.startTime) >= yearStart);
    }
    default:
      return citas;
  }
};

// Estadísticas según periodo seleccionado
const stats = computed(() => {
  const allCitas = citas.value;
  const periodCitas = filterByPeriod(allCitas, statsPeriod.value);
  
  return {
    total: periodCitas.length,
    completadas: periodCitas.filter(c => c.status === 'COMPLETED').length,
    pendientes: periodCitas.filter(c => c.status === 'PENDING').length,
    canceladas: periodCitas.filter(c => c.status === 'CANCELLED').length,
  };
});

// Citas filtradas
const filteredCitas = computed(() => {
  let result = [...citas.value];

  // Filtrar por modo (activas o archivadas)
  if (viewMode.value === 'active') {
    result = result.filter(c => !isArchived(c));
  } else {
    result = result.filter(c => isArchived(c));
  }

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(c => 
      c.client.name.toLowerCase().includes(query) ||
      c.service.name.toLowerCase().includes(query) ||
      (c.client.phone && c.client.phone.includes(query))
    );
  }

  // Filtrar por estado (solo en vista activa)
  if (viewMode.value === 'active' && filterStatus.value !== 'all') {
    result = result.filter(c => c.status === filterStatus.value);
  }

  // Filtrar por fecha
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (viewMode.value === 'active') {
    if (dateFilter.value === 'today') {
      const hoyStr = now.toISOString().split('T')[0];
      result = result.filter(c => c.startTime.startsWith(hoyStr));
    } else if (dateFilter.value === 'week') {
      const unaSemana = new Date(now);
      unaSemana.setDate(now.getDate() + 7);
      result = result.filter(c => {
        const citaDate = new Date(c.startTime);
        return citaDate >= now && citaDate <= unaSemana;
      });
    } else if (dateFilter.value === 'month') {
      const unMes = new Date(now);
      unMes.setMonth(now.getMonth() + 1);
      result = result.filter(c => {
        const citaDate = new Date(c.startTime);
        return citaDate >= now && citaDate <= unMes;
      });
    }
  } else {
    // Filtros para archivadas (hacia atrás en el tiempo)
    if (archivedDateFilter.value === 'last-week') {
      const unaSemanaAtras = new Date(now);
      unaSemanaAtras.setDate(now.getDate() - 7);
      result = result.filter(c => {
        const citaDate = new Date(c.endTime);
        return citaDate >= unaSemanaAtras && citaDate <= now;
      });
    } else if (archivedDateFilter.value === 'last-month') {
      const unMesAtras = new Date(now);
      unMesAtras.setMonth(now.getMonth() - 1);
      result = result.filter(c => {
        const citaDate = new Date(c.endTime);
        return citaDate >= unMesAtras && citaDate <= now;
      });
    } else if (archivedDateFilter.value === 'last-3-months') {
      const tresMesesAtras = new Date(now);
      tresMesesAtras.setMonth(now.getMonth() - 3);
      result = result.filter(c => {
        const citaDate = new Date(c.endTime);
        return citaDate >= tresMesesAtras && citaDate <= now;
      });
    } else if (archivedDateFilter.value === 'last-year') {
      const unAnoAtras = new Date(now);
      unAnoAtras.setFullYear(now.getFullYear() - 1);
      result = result.filter(c => {
        const citaDate = new Date(c.endTime);
        return citaDate >= unAnoAtras && citaDate <= now;
      });
    }
  }

  // Ordenar
  if (viewMode.value === 'active') {
    result.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  } else {
    result.sort((a, b) => new Date(b.endTime) - new Date(a.endTime)); // Más recientes primero
  }

  return result;
});

// Cargar citas
const fetchCitas = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No autenticado');
      return;
    }
    
    const res = await axios.get(`${API_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    citas.value = res.data;
    console.log('✅ Citas cargadas:', res.data.length);
  } catch (error) {
    console.error('❌ Error cargando citas:', error);
  } finally {
    loading.value = false;
  }
};

// Actualizar estado de cita
const updateStatus = async (citaId, newStatus) => {
  try {
    const token = localStorage.getItem('token');
    
    await axios.put(
      `${API_URL}/appointments/${citaId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // Actualizar localmente
    const cita = citas.value.find(c => c.id === citaId);
    if (cita) {
      cita.status = newStatus;
    }
    
    console.log('✅ Estado actualizado');
  } catch (error) {
    console.error('❌ Error actualizando estado:', error);
  }
};

// Mostrar detalles
const showDetails = (cita) => {
  selectedCita.value = cita;
  showDetailModal.value = true;
};

// Formatear fecha
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Formatear fecha corta
const formatFechaCorta = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Formatear hora
const formatHora = (fecha) => {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formatear precio
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

// Obtener clase de estado
const getStatusClass = (status) => {
  const classes = {
    'PENDING': 'status-pending',
    'CONFIRMED': 'status-confirmed',
    'COMPLETED': 'status-completed',
    'CANCELLED': 'status-cancelled'
  };
  return classes[status] || '';
};

// Obtener texto de estado
const getStatusText = (status) => {
  const texts = {
    'PENDING': 'Pendiente',
    'CONFIRMED': 'Confirmada',
    'COMPLETED': 'Completada',
    'CANCELLED': 'Cancelada'
  };
  return texts[status] || status;
};

// Listener para actualizar citas en tiempo real
const handleAppointmentUpdate = (data) => {
  console.log('📅 Actualizando lista de citas...', data);
  fetchCitas();
};

onMounted(() => {
  fetchCitas();
  
  // Escuchar eventos de citas
  on('appointment-created', handleAppointmentUpdate);
  on('appointment-updated', handleAppointmentUpdate);
  on('appointment-cancelled', handleAppointmentUpdate);
});

onBeforeUnmount(() => {
  off('appointment-created', handleAppointmentUpdate);
  off('appointment-updated', handleAppointmentUpdate);
  off('appointment-cancelled', handleAppointmentUpdate);
});
</script>

<style scoped>
.citas-container {
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

/* Estadísticas */
.stats-section {
  margin-bottom: 2rem;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.stats-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.period-selector {
  display: flex;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 10px;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn:hover {
  color: #1e293b;
  background: rgba(255, 255, 255, 0.5);
}

.period-btn.active {
  background: white;
  color: #6366f1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
}

.stat-icon svg {
  width: 1.75rem;
  height: 1.75rem;
  color: white;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

/* Filtros */
.filters-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.search-icon svg {
  width: 100%;
  height: 100%;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.25rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn .btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.filter-btn-small {
  padding: 0.625rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.filter-btn-small:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn-small.active {
  background: #667eea;
  color: white;
  border-color: transparent;
}

.date-filter {
  min-width: 180px;
}

.date-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.date-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

/* Grid de citas */
.citas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.cita-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.cita-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.cita-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.client-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.client-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.client-phone {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-confirmed {
  background: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.cita-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.detail-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #667eea;
  flex-shrink: 0;
}

.detail-icon svg {
  width: 100%;
  height: 100%;
}

.detail-text {
  color: #475569;
  font-size: 0.95rem;
}

.cita-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cita-actions button {
  flex: 1;
  min-width: 100px;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.cita-actions button .btn-icon {
  width: 1rem;
  height: 1rem;
}

.btn-confirm {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-confirm:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-cancel:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.archived-info {
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.archived-date {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.archived-date .inline-icon {
  width: 1rem;
  height: 1rem;
}

.btn-details {
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-details:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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
  font-size: 1.5rem;
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
  width: 1.25rem;
  height: 1.25rem;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 500;
}

.info-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  width: fit-content;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1.5rem;
  color: #cbd5e1;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  color: #64748b;
  margin: 0;
}

@media (max-width: 768px) {
  .citas-container {
    padding: 1rem;
  }
  
  .filters-container {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .date-filter {
    width: 100%;
  }
  
  .citas-grid {
    grid-template-columns: 1fr;
  }
}
</style>
