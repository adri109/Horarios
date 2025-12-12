<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Estado
const clients = ref([]);
const loading = ref(true);
const selectedChannel = ref('email'); // email, whatsapp, both
const campaignType = ref('promotional'); // promotional, reminder, custom

// Datos de la campaña
const campaignData = ref({
  subject: '',
  message: '',
  selectedClients: [],
  sendToAll: true,
  scheduleDate: '',
  scheduleTime: ''
});

// Plantillas predefinidas
const templates = {
  email: {
    promotional: {
      subject: '¡Oferta especial solo para ti! 🎉',
      message: 'Hola {nombre},\n\nQueremos agradecerte tu fidelidad con una oferta exclusiva.\n\n✨ Obtén un 20% de descuento en tu próxima cita\n\n📅 Reserva ahora: {salon_url}\n\nEsta oferta es válida hasta fin de mes.\n\n¡Te esperamos!\n\nEquipo {salon_name}'
    },
    reminder: {
      subject: '⏰ No olvides tu cita con nosotros',
      message: 'Hola {nombre},\n\nTe recordamos que tienes una cita próximamente.\n\n¿Hace tiempo que no nos visitas? ¡Te echamos de menos!\n\n📅 Reserva tu próxima cita: {salon_url}\n\nEstamos aquí para cuidarte.\n\nSaludos,\nEquipo {salon_name}'
    },
    custom: {
      subject: '',
      message: ''
    }
  },
  whatsapp: {
    promotional: {
      message: '🎉 *¡Oferta especial!*\n\nHola {nombre},\n\nTenemos algo especial para ti:\n✨ *20% de descuento* en tu próxima cita\n\n📅 Reserva aquí: {salon_url}\n\nVálido hasta fin de mes.\n\n_{salon_name}_'
    },
    reminder: {
      message: '⏰ *¡Te echamos de menos!*\n\nHola {nombre},\n\n¿Hace tiempo que no vienes? 😊\n\nReserva tu próxima cita aquí:\n📅 {salon_url}\n\n_{salon_name}_'
    },
    custom: {
      message: ''
    }
  }
};

// Estadísticas
const stats = computed(() => {
  const total = clients.value.length;
  const selected = campaignData.value.sendToAll 
    ? total 
    : campaignData.value.selectedClients.length;
  
  return {
    totalClients: total,
    selectedClients: selected,
    estimatedReach: selected
  };
});

// Cargar clientes
const loadClients = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/clients`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    clients.value = response.data;
  } catch (error) {
    console.error('Error cargando clientes:', error);
    alert('Error al cargar clientes');
  } finally {
    loading.value = false;
  }
};

// Aplicar plantilla
const applyTemplate = () => {
  if (selectedChannel.value === 'email') {
    const template = templates.email[campaignType.value];
    campaignData.value.subject = template.subject;
    campaignData.value.message = template.message;
  } else if (selectedChannel.value === 'whatsapp') {
    const template = templates.whatsapp[campaignType.value];
    campaignData.value.subject = '';
    campaignData.value.message = template.message;
  }
};

// Vista previa del mensaje
const previewMessage = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const salonName = user.salon?.name || 'Tu Salón';
  const salonSlug = user.salon?.slug || 'tu-salon';
  
  let msg = campaignData.value.message;
  msg = msg.replace(/{nombre}/g, 'Juan Pérez');
  msg = msg.replace(/{salon_name}/g, salonName);
  msg = msg.replace(/{salon_url}/g, `http://localhost:8080/salon/${salonSlug}`);
  
  return msg;
});

// Toggle selección de cliente
const toggleClientSelection = (clientId) => {
  const index = campaignData.value.selectedClients.indexOf(clientId);
  if (index > -1) {
    campaignData.value.selectedClients.splice(index, 1);
  } else {
    campaignData.value.selectedClients.push(clientId);
  }
};

// Seleccionar todos los clientes
const selectAllClients = () => {
  if (campaignData.value.selectedClients.length === clients.value.length) {
    campaignData.value.selectedClients = [];
  } else {
    campaignData.value.selectedClients = clients.value.map(c => c.id);
  }
};

// Enviar campaña
const sendCampaign = async () => {
  if (!campaignData.value.message.trim()) {
    alert('Por favor, escribe un mensaje');
    return;
  }

  if (selectedChannel.value === 'email' && !campaignData.value.subject.trim()) {
    alert('Por favor, escribe un asunto para el email');
    return;
  }

  if (!campaignData.value.sendToAll && campaignData.value.selectedClients.length === 0) {
    alert('Por favor, selecciona al menos un cliente');
    return;
  }

  const confirmMsg = `¿Enviar campaña a ${stats.value.selectedClients} cliente(s)?`;
  if (!confirm(confirmMsg)) return;

  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `${API_URL}/marketing/send-campaign`,
      {
        channel: selectedChannel.value,
        type: campaignType.value,
        subject: campaignData.value.subject,
        message: campaignData.value.message,
        sendToAll: campaignData.value.sendToAll,
        selectedClients: campaignData.value.selectedClients
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    const results = response.data.results;
    alert(`✅ Campaña enviada!\n\nTotal: ${results.total}\nExitosos: ${results.success}\nFallidos: ${results.failed}`);
    
    // Reset form
    campaignData.value = {
      subject: '',
      message: '',
      selectedClients: [],
      sendToAll: true,
      scheduleDate: '',
      scheduleTime: ''
    };
    
    applyTemplate();
  } catch (error) {
    console.error('Error enviando campaña:', error);
    alert('❌ Error al enviar la campaña. Verifica la consola para más detalles.');
  }
};

// Watch para aplicar plantilla automáticamente
const handleChannelOrTypeChange = () => {
  applyTemplate();
};

onMounted(() => {
  loadClients();
  applyTemplate();
});
</script>

<template>
  <div class="marketing-container">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="title">📣 Marketing y Promociones</h1>
        <p class="subtitle">Crea campañas para fidelizar y atraer clientes</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>

    <div v-else class="content-grid">
      <!-- Panel izquierdo: Configuración -->
      <div class="config-panel">
        <!-- Estadísticas rápidas -->
        <div class="stats-mini">
          <div class="stat-mini">
            <span class="stat-mini-icon">👥</span>
            <div>
              <p class="stat-mini-value">{{ stats.totalClients }}</p>
              <p class="stat-mini-label">Clientes totales</p>
            </div>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-icon">📧</span>
            <div>
              <p class="stat-mini-value">{{ stats.selectedClients }}</p>
              <p class="stat-mini-label">Destinatarios</p>
            </div>
          </div>
        </div>

        <!-- Selección de canal -->
        <div class="config-section">
          <h3 class="section-subtitle">📱 Canal de envío</h3>
          <div class="channel-buttons">
            <button 
              :class="['channel-btn', { active: selectedChannel === 'email' }]"
              @click="selectedChannel = 'email'; handleChannelOrTypeChange()"
            >
              <span class="channel-icon">📧</span>
              <span>Email</span>
            </button>
            <button 
              :class="['channel-btn', { active: selectedChannel === 'whatsapp' }]"
              @click="selectedChannel = 'whatsapp'; handleChannelOrTypeChange()"
            >
              <span class="channel-icon">💬</span>
              <span>WhatsApp</span>
            </button>
            <button 
              :class="['channel-btn', { active: selectedChannel === 'both' }]"
              @click="selectedChannel = 'both'; handleChannelOrTypeChange()"
            >
              <span class="channel-icon">🚀</span>
              <span>Ambos</span>
            </button>
          </div>
        </div>

        <!-- Tipo de campaña -->
        <div class="config-section">
          <h3 class="section-subtitle">🎯 Tipo de campaña</h3>
          <select 
            v-model="campaignType" 
            @change="handleChannelOrTypeChange"
            class="input-select"
          >
            <option value="promotional">🎉 Oferta promocional</option>
            <option value="reminder">⏰ Recordatorio</option>
            <option value="custom">✏️ Personalizado</option>
          </select>
        </div>

        <!-- Asunto (solo email) -->
        <div v-if="selectedChannel === 'email' || selectedChannel === 'both'" class="config-section">
          <h3 class="section-subtitle">📋 Asunto del email</h3>
          <input 
            v-model="campaignData.subject" 
            type="text" 
            class="input-text"
            placeholder="Escribe el asunto del email..."
          />
        </div>

        <!-- Mensaje -->
        <div class="config-section">
          <h3 class="section-subtitle">✍️ Mensaje</h3>
          <textarea 
            v-model="campaignData.message" 
            rows="8"
            class="input-textarea"
            placeholder="Escribe tu mensaje aquí..."
          ></textarea>
          <p class="input-hint">
            Variables disponibles: {nombre}, {salon_name}, {salon_url}
          </p>
        </div>

        <!-- Destinatarios -->
        <div class="config-section">
          <h3 class="section-subtitle">👥 Destinatarios</h3>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="campaignData.sendToAll" 
                :value="true"
              />
              <span>Enviar a todos los clientes ({{ clients.length }})</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="campaignData.sendToAll" 
                :value="false"
              />
              <span>Seleccionar clientes manualmente</span>
            </label>
          </div>
        </div>

        <!-- Lista de clientes (si no es a todos) -->
        <div v-if="!campaignData.sendToAll" class="config-section">
          <div class="clients-header">
            <h3 class="section-subtitle">Selecciona clientes</h3>
            <button @click="selectAllClients" class="btn-select-all">
              {{ campaignData.selectedClients.length === clients.length ? 'Deseleccionar todos' : 'Seleccionar todos' }}
            </button>
          </div>
          <div class="clients-list">
            <label 
              v-for="client in clients" 
              :key="client.id"
              class="client-checkbox"
            >
              <input 
                type="checkbox" 
                :checked="campaignData.selectedClients.includes(client.id)"
                @change="toggleClientSelection(client.id)"
              />
              <span>{{ client.name }}</span>
              <span class="client-phone">{{ client.phone }}</span>
            </label>
          </div>
        </div>

        <!-- Botón enviar -->
        <button @click="sendCampaign" class="btn-send">
          🚀 Enviar Campaña ({{ stats.selectedClients }} destinatarios)
        </button>
      </div>

      <!-- Panel derecho: Vista previa -->
      <div class="preview-panel">
        <h3 class="preview-title">👁️ Vista previa</h3>
        
        <div class="preview-card">
          <!-- Vista previa Email -->
          <div v-if="selectedChannel === 'email' || selectedChannel === 'both'" class="preview-email">
            <div class="email-header">
              <span class="email-icon">📧</span>
              <span class="email-label">Email</span>
            </div>
            <div class="email-subject">
              <strong>Asunto:</strong> {{ campaignData.subject || '(Sin asunto)' }}
            </div>
            <div class="email-body">
              {{ previewMessage || '(Escribe un mensaje)' }}
            </div>
          </div>

          <!-- Vista previa WhatsApp -->
          <div v-if="selectedChannel === 'whatsapp' || selectedChannel === 'both'" class="preview-whatsapp">
            <div class="whatsapp-header">
              <span class="whatsapp-icon">💬</span>
              <span class="whatsapp-label">WhatsApp</span>
            </div>
            <div class="whatsapp-bubble">
              {{ previewMessage || '(Escribe un mensaje)' }}
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="info-box">
          <h4 class="info-title">ℹ️ Información importante</h4>
          <ul class="info-list">
            <li>Los mensajes se personalizan automáticamente para cada cliente</li>
            <li>Puedes usar variables como {nombre}, {salon_name}, {salon_url}</li>
            <li>Las campañas se envían de forma inmediata</li>
            <li>Asegúrate de revisar la vista previa antes de enviar</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marketing-container {
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.config-panel,
.preview-panel {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stats-mini {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 0.75rem;
  border: 1px solid #bae6fd;
}

.stat-mini-icon {
  font-size: 2rem;
}

.stat-mini-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0284c7;
}

.stat-mini-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.config-section {
  margin-bottom: 1.5rem;
}

.section-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.channel-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.channel-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.channel-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.channel-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.channel-icon {
  font-size: 1.5rem;
}

.input-select,
.input-text,
.input-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.input-select:focus,
.input-text:focus,
.input-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-textarea {
  resize: vertical;
  font-family: inherit;
}

.input-hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.radio-label input[type="radio"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.clients-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.btn-select-all {
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-select-all:hover {
  background: #e5e7eb;
}

.clients-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.client-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.client-checkbox:hover {
  background: #f9fafb;
}

.client-checkbox input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.client-phone {
  margin-left: auto;
  font-size: 0.75rem;
  color: #6b7280;
}

.btn-send {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-send:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.preview-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.preview-card {
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.preview-email,
.preview-whatsapp {
  margin-bottom: 1.5rem;
}

.preview-email:last-child,
.preview-whatsapp:last-child {
  margin-bottom: 0;
}

.email-header,
.whatsapp-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.email-icon,
.whatsapp-icon {
  font-size: 1.25rem;
}

.email-label,
.whatsapp-label {
  font-weight: 600;
  color: #374151;
}

.email-subject {
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

.email-body {
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  white-space: pre-wrap;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
}

.whatsapp-bubble {
  background: #dcf8c6;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border-bottom-right-radius: 0.25rem;
  white-space: pre-wrap;
  font-size: 0.875rem;
  color: #1f2937;
  line-height: 1.6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.info-box {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #fbbf24;
}

.info-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
}

.info-list {
  list-style: disc;
  padding-left: 1.25rem;
  margin: 0;
  font-size: 0.75rem;
  color: #78350f;
}

.info-list li {
  margin-bottom: 0.25rem;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.h-64 {
  height: 16rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
