<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const clients = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const sortBy = ref('recent'); // recent, name, spent
const selectedClient = ref(null);
const showClientDetail = ref(false);

const API_URL = 'http://localhost:3000';

// Estadísticas generales
const stats = computed(() => {
  if (clients.value.length === 0) return { total: 0, totalRevenue: 0, avgPerClient: 0 };
  
  const total = clients.value.length;
  const totalRevenue = clients.value.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgPerClient = total > 0 ? totalRevenue / total : 0;
  
  return { total, totalRevenue, avgPerClient };
});

// Clientes filtrados y ordenados
const filteredClients = computed(() => {
  let result = [...clients.value];
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(c => 
      c.name.toLowerCase().includes(query) || 
      (c.phone && c.phone.includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query))
    );
  }
  
  // Ordenar
  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'spent') {
    result.sort((a, b) => b.totalSpent - a.totalSpent);
  } else {
    // Por defecto: más recientes primero
    result.sort((a, b) => {
      if (!a.lastAppointmentDate) return 1;
      if (!b.lastAppointmentDate) return -1;
      return new Date(b.lastAppointmentDate) - new Date(a.lastAppointmentDate);
    });
  }
  
  return result;
});

// Cargar clientes
const fetchClients = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No hay token de autenticación');
      alert('No estás autenticado. Por favor, inicia sesión.');
      return;
    }
    
    console.log('📤 Solicitando clientes...');
    const response = await axios.get(`${API_URL}/clients`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Clientes recibidos:', response.data);
    clients.value = response.data;
  } catch (error) {
    console.error('❌ Error cargando clientes:', error);
    console.error('❌ Respuesta del servidor:', error.response?.data);
    console.error('❌ Status:', error.response?.status);
    
    // Si el token es inválido, redirigir al login
    if (error.response?.status === 403 || error.response?.status === 401) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    
    const errorMsg = error.response?.data?.error || 'Error al cargar los clientes';
    alert(`Error: ${errorMsg}`);
  } finally {
    loading.value = false;
  }
};

// Ver detalle del cliente
const viewClientDetail = (client) => {
  selectedClient.value = client;
  showClientDetail.value = true;
};

// Cerrar detalle
const closeDetail = () => {
  showClientDetail.value = false;
  selectedClient.value = null;
};

// Formatear fecha
const formatDate = (date) => {
  if (!date) return 'Nunca';
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Formatear precio
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

onMounted(() => {
  fetchClients();
});
</script>

<template>
  <div class="clientes-container">
    <!-- Header con estadísticas -->
    <div class="header">
      <div>
        <h1 class="title">Clientes</h1>
        <p class="subtitle">Gestiona tu base de clientes</p>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div>
          <p class="stat-value">{{ stats.total }}</p>
          <p class="stat-label">Total Clientes</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div>
          <p class="stat-value">{{ formatPrice(stats.totalRevenue) }}</p>
          <p class="stat-label">Ingresos Totales</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div>
          <p class="stat-value">{{ formatPrice(stats.avgPerClient) }}</p>
          <p class="stat-label">Media por Cliente</p>
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filters-container">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar por nombre, teléfono o email..."
          class="search-input"
        />
      </div>
      
      <div class="sort-buttons">
        <button 
          :class="['sort-btn', { active: sortBy === 'recent' }]"
          @click="sortBy = 'recent'"
        >
          Recientes
        </button>
        <button 
          :class="['sort-btn', { active: sortBy === 'name' }]"
          @click="sortBy = 'name'"
        >
          Nombre
        </button>
        <button 
          :class="['sort-btn', { active: sortBy === 'spent' }]"
          @click="sortBy = 'spent'"
        >
          Gastos
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando clientes...</p>
    </div>

    <!-- Tabla de clientes -->
    <div v-else-if="filteredClients.length > 0" class="table-container">
      <table class="clients-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Citas</th>
            <th>Última Visita</th>
            <th>Último Servicio</th>
            <th>Total Gastado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in filteredClients" :key="client.id" class="client-row">
            <td class="client-name">
              <div class="name-circle">{{ client.name.charAt(0).toUpperCase() }}</div>
              <span>{{ client.name }}</span>
            </td>
            <td>{{ client.phone || 'Sin teléfono' }}</td>
            <td>
              <div class="appointments-badge">
                <span class="badge completed">✓ {{ client.completedAppointments }}</span>
                <span v-if="client.cancelledAppointments > 0" class="badge cancelled">
                  ✗ {{ client.cancelledAppointments }}
                </span>
              </div>
            </td>
            <td>{{ formatDate(client.lastAppointmentDate) }}</td>
            <td>
              <span class="service-name">{{ client.lastService || '-' }}</span>
            </td>
            <td class="amount">{{ formatPrice(client.totalSpent) }}</td>
            <td>
              <button @click="viewClientDetail(client)" class="btn-view">
                Ver detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sin resultados -->
    <div v-else class="empty-state">
      <div class="empty-icon">🔍</div>
      <p class="empty-title">No se encontraron clientes</p>
      <p class="empty-subtitle">
        {{ searchQuery ? 'Intenta con otra búsqueda' : 'Aún no tienes clientes registrados' }}
      </p>
    </div>

    <!-- Modal de detalle del cliente -->
    <div v-if="showClientDetail" class="modal-overlay" @click="closeDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedClient.name }}</h2>
          <button @click="closeDetail" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="detail-section">
            <h3>Información de Contacto</h3>
            <p><strong>Teléfono:</strong> {{ selectedClient.phone || 'No registrado' }}</p>
            <p><strong>Email:</strong> {{ selectedClient.email || 'No registrado' }}</p>
          </div>
          
          <div class="detail-section">
            <h3>Estadísticas</h3>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-number">{{ selectedClient.totalAppointments }}</span>
                <span class="stat-text">Citas totales</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ selectedClient.completedAppointments }}</span>
                <span class="stat-text">Completadas</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ selectedClient.cancelledAppointments }}</span>
                <span class="stat-text">Canceladas</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ formatPrice(selectedClient.totalSpent) }}</span>
                <span class="stat-text">Total gastado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clientes-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
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

/* Estadísticas */
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
  font-size: 2.5rem;
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
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
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

.sort-buttons {
  display: flex;
  gap: 0.5rem;
}

.sort-btn {
  padding: 0.875rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.sort-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.sort-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
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

/* Tabla */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
}

.clients-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.clients-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.client-row {
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;
}

.client-row:hover {
  background-color: #f8fafc;
}

.clients-table td {
  padding: 1rem;
  color: #1e293b;
}

.client-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
}

.name-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
}

.appointments-badge {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.service-name {
  color: #64748b;
  font-size: 0.875rem;
}

.amount {
  font-weight: 700;
  color: #059669;
}

.btn-view {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-view:hover {
  transform: scale(1.05);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
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

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-section p {
  color: #64748b;
  margin: 0.5rem 0;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.stat-text {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .clientes-container {
    padding: 1rem;
  }
  
  .filters-container {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .clients-table {
    min-width: 800px;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>
