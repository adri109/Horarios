<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/utils/axios';
import { usePermissions } from '../../composables/usePermissions';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

// Verificar permisos
usePermissions('canViewMarketing');

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
      subject: '¡Oferta especial solo para ti!',
      message: 'Hola {nombre},\n\nQueremos agradecerte tu fidelidad con una oferta exclusiva.\n\n✨ Obtén un 20% de descuento en tu próxima cita\n\n👉 Reserva ahora: {salon_url}\n\nEsta oferta es válida hasta fin de mes.\n\n¡Te esperamos!\n\nEquipo {salon_name}'
    },
    reminder: {
      subject: 'No olvides tu cita con nosotros',
      message: 'Hola {nombre},\n\nTe recordamos que tienes una cita próximamente.\n\n💕 ¿Hace tiempo que no nos visitas? ¡Te echamos de menos!\n\n👉 Reserva tu próxima cita: {salon_url}\n\nEstamos aquí para cuidarte.\n\nSaludos,\nEquipo {salon_name}'
    },
    custom: {
      subject: '',
      message: ''
    }
  },
  whatsapp: {
    promotional: {
      message: '🎉 *¡Oferta especial!*\n\nHola {nombre},\n\nTenemos algo especial para ti:\n✨ *20% de descuento* en tu próxima cita\n\n👉 Reserva aquí: {salon_url}\n\nVálido hasta fin de mes.\n\n_{salon_name}_'
    },
    reminder: {
      message: '💕 *¡Te echamos de menos!*\n\nHola {nombre},\n\n¿Hace tiempo que no vienes? 😊\n\n👉 Reserva tu próxima cita aquí:\n{salon_url}\n\n_{salon_name}_'
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
        <h1 class="title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
          </svg>
          Marketing y Promociones
        </h1>
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
            <span class="stat-mini-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </span>
            <div>
              <p class="stat-mini-value">{{ stats.totalClients }}</p>
              <p class="stat-mini-label">Clientes totales</p>
            </div>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <div>
              <p class="stat-mini-value">{{ stats.selectedClients }}</p>
              <p class="stat-mini-label">Destinatarios</p>
            </div>
          </div>
        </div>

        <!-- Selección de canal -->
        <div class="config-section">
          <h3 class="section-subtitle flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            Canal de envío
          </h3>
          <div class="channel-buttons">
            <button 
              :class="['channel-btn', { active: selectedChannel === 'email' }]"
              @click="selectedChannel = 'email'; handleChannelOrTypeChange()"
            >
              <span class="channel-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <span>Email</span>
            </button>
            <button 
              :class="['channel-btn', { active: selectedChannel === 'whatsapp' }]"
              @click="selectedChannel = 'whatsapp'; handleChannelOrTypeChange()"
            >
              <span class="channel-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </span>
              <span>WhatsApp</span>
            </button>
            <button 
              :class="['channel-btn', { active: selectedChannel === 'both' }]"
              @click="selectedChannel = 'both'; handleChannelOrTypeChange()"
            >
              <span class="channel-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </span>
              <span>Ambos</span>
            </button>
          </div>
        </div>

        <!-- Tipo de campaña -->
        <div class="config-section">
          <h3 class="section-subtitle flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            Tipo de campaña
          </h3>
          <select 
            v-model="campaignType" 
            @change="handleChannelOrTypeChange"
            class="input-select"
          >
            <option value="promotional">Oferta promocional</option>
            <option value="reminder">Recordatorio</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        <!-- Asunto (solo email) -->
        <div v-if="selectedChannel === 'email' || selectedChannel === 'both'" class="config-section">
          <h3 class="section-subtitle flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            Asunto del email
          </h3>
          <input 
            v-model="campaignData.subject" 
            type="text" 
            class="input-text"
            placeholder="Escribe el asunto del email..."
          />
        </div>

        <!-- Mensaje -->
        <div class="config-section">
          <h3 class="section-subtitle flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Mensaje
          </h3>
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
          <h3 class="section-subtitle flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Destinatarios
          </h3>
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
        <button @click="sendCampaign" class="btn-send flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          Enviar Campaña ({{ stats.selectedClients }} destinatarios)
        </button>
      </div>

      <!-- Panel derecho: Vista previa -->
      <div class="preview-panel">
        <h3 class="preview-title flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Vista previa
        </h3>
        
        <div class="preview-card">
          <!-- Vista previa Email -->
          <div v-if="selectedChannel === 'email' || selectedChannel === 'both'" class="preview-email">
            <div class="email-header">
              <span class="email-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
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
              <span class="whatsapp-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </span>
              <span class="whatsapp-label">WhatsApp</span>
            </div>
            <div class="whatsapp-bubble">
              {{ previewMessage || '(Escribe un mensaje)' }}
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="info-box">
          <h4 class="info-title flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            Información importante
          </h4>
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
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
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
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
}

.stat-mini-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
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

.section-subtitle svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #667eea;
  flex-shrink: 0;
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

.channel-btn.active .channel-icon svg {
  color: white;
}

.channel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #667eea;
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
  accent-color: #667eea;
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

.btn-send svg {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
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

.preview-title svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #667eea;
  flex-shrink: 0;
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
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  border-bottom: 2px solid #e5e7eb;
}

.email-icon,
.whatsapp-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.email-icon svg,
.whatsapp-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.email-label,
.whatsapp-label {
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
}

.email-subject {
  padding: 0.75rem;
  background: #f8f9fa;
  border-left: 3px solid #667eea;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

.email-body {
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  white-space: pre-wrap;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
}

.whatsapp-bubble {
  background: linear-gradient(135deg, #dcf8c6 0%, #d4f4c0 100%);
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border-bottom-right-radius: 0.25rem;
  white-space: pre-wrap;
  font-size: 0.875rem;
  color: #1f2937;
  line-height: 1.6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #c5e8a8;
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

.info-title svg {
  width: 1.125rem;
  height: 1.125rem;
  color: #d97706;
  flex-shrink: 0;
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
