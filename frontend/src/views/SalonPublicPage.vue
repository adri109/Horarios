<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
    <!-- Header decorativo -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 shadow-lg">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">BeautySalon</h1>
            <p class="text-purple-100">Reserva tu cita online</p>
          </div>
          <!-- Botón de acceso al dashboard si está autenticado -->
          <router-link
            v-if="isAuthenticated"
            to="/dashboard/resume"
            class="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Ir al Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-solid mb-4"></div>
        <p class="text-gray-600 text-lg font-medium">Cargando salón...</p>
      </div>

      <!-- Salón no encontrado -->
      <div
        v-else-if="!salon"
        class="bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Salón no encontrado</h2>
        <p class="text-gray-600">El salón que buscas no existe o no está disponible</p>
      </div>

      <!-- Contenido -->
      <div v-else class="space-y-6">
        <!-- Información del salón -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-purple-600">
          <h2 class="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {{ salon.name }}
          </h2>
          <div class="flex flex-wrap gap-4 text-gray-700">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ salon.address }}
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              {{ salon.phone }}
            </div>
          </div>
        </div>

        <!-- Servicios -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center text-gray-800">
            <svg class="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
            </svg>
            Nuestros Servicios
          </h2>
          
          <div v-if="services.length === 0" class="text-center py-10">
            <div class="text-6xl mb-4">💈</div>
            <p class="text-gray-500 text-lg">Este salón aún no tiene servicios disponibles</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="service in services"
              :key="service.id"
              @click="selectService(service)"
              :class="[
                'group relative p-4 border-2 rounded-xl transition-all duration-300 text-left',
                selectedService?.id === service.id
                  ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-105'
                  : 'border-purple-200 hover:border-purple-400 hover:shadow-lg bg-white'
              ]"
            >
              <!-- Icono de servicio -->
              <div class="flex items-start gap-3 mb-3">
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  selectedService?.id === service.id 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                    : 'bg-gradient-to-br from-purple-100 to-pink-100'
                ]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" :stroke="selectedService?.id === service.id ? 'white' : '#9333ea'" class="w-7 h-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-lg text-gray-800 mb-1 leading-tight">
                    {{ service.name }}
                  </h3>
                  <p class="text-gray-600 text-sm line-clamp-2">{{ service.description || 'Servicio profesional' }}</p>
                </div>
              </div>

              <!-- Info del servicio -->
              <div class="flex items-center justify-between pt-3 border-t border-purple-100">
                <div class="flex items-center gap-1 text-purple-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-bold text-lg">€{{ service.price }}</span>
                </div>
                <div class="flex items-center gap-1 text-gray-600 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-semibold">{{ service.duration }} min</span>
                </div>
              </div>

              <!-- Checkmark si está seleccionado -->
              <div v-if="selectedService?.id === service.id" class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Reserva -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center text-gray-800">
            <svg class="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Reserva tu Cita
          </h2>

          <!-- Mensaje: selecciona servicio primero -->
          <div v-if="!selectedService" class="text-center py-10">
            <div class="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-purple-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </div>
            <p class="text-gray-600 text-lg font-medium">Primero selecciona un servicio arriba</p>
          </div>

          <div v-else>
            <!-- Resumen del servicio seleccionado -->
            <div class="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
              <p class="text-sm text-gray-600 mb-1">Servicio seleccionado:</p>
              <p class="font-bold text-lg text-gray-800">{{ selectedService.name }}</p>
              <p class="text-sm text-gray-600">Duración: {{ selectedService.duration }} min | Precio: €{{ selectedService.price }}</p>
            </div>

            <!-- Selector de fecha rediseñado -->
            <div class="mb-8">
              <label class="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-purple-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Selecciona la fecha
              </label>
              <div class="relative">
                <input
                  type="date"
                  id="reservation-date"
                  v-model="selectedDate"
                  :min="new Date().toISOString().split('T')[0]"
                  class="w-full p-4 pl-14 pr-4 border-2 border-purple-300 rounded-xl shadow-sm focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-base font-medium transition-all bg-white cursor-pointer hover:border-purple-400 hover:shadow-md"
                  style="color-scheme: light;"
                />
                <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-purple-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Loading slots -->
            <div v-if="loadingSlots" class="text-center py-10">
              <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-solid mx-auto mb-4"></div>
              <p class="text-gray-600">Cargando horarios disponibles...</p>
            </div>

            <!-- Horarios disponibles rediseñados -->
            <div v-else-if="allSlots.length > 0">
              <div class="mb-6 flex items-center justify-between flex-wrap gap-3">
                <label class="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-purple-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Elige tu hora
                </label>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-semibold border border-green-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 inline mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {{ displaySlots.length }} libres
                  </span>
                  <span v-if="allSlots.filter(s => s.occupied).length > 0" class="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 inline mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ allSlots.filter(s => s.occupied).length }} ocupadas
                  </span>
                </div>
              </div>
              
              <!-- Mostrar horarios agrupados por turnos -->
              <div 
                v-for="(group, index) in groupSlotsByShifts(allSlots, scheduleData)" 
                :key="index"
                class="mb-6 last:mb-0"
              >
                <div class="flex items-center gap-3 mb-4">
                  <div class="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                  <h3 class="text-sm font-bold text-purple-700 uppercase tracking-wide px-4 py-1.5 bg-purple-50 rounded-full border border-purple-200">
                    {{ group.name }}
                  </h3>
                  <div class="h-px flex-1 bg-gradient-to-r from-purple-300 via-transparent to-transparent"></div>
                </div>
                
                <div v-if="group.opening && group.closing" class="text-center mb-4">
                  <span class="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    {{ group.opening }} - {{ group.closing }}
                  </span>
                </div>
                
                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  <button
                    v-for="slot in group.slots"
                    :key="slot.time"
                    @click="slot.available ? selectSlot(slot.time) : null"
                    :disabled="slot.occupied || slot.passed"
                    :class="[
                      'relative py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200',
                      slot.time === selectedSlot
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-105 ring-2 ring-purple-400'
                        : slot.passed
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        : slot.occupied
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70 border border-gray-300'
                        : 'bg-white text-purple-700 hover:bg-purple-50 hover:scale-102 hover:shadow-md border-2 border-purple-200 hover:border-purple-400 cursor-pointer',
                    ]"
                  >
                    <span class="flex items-center justify-center gap-1.5">
                      {{ slot.time }}
                      <svg 
                        v-if="slot.time === selectedSlot"
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke-width="3" 
                        stroke="currentColor" 
                        class="w-4 h-4"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <svg 
                        v-else-if="slot.occupied"
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke-width="2.5" 
                        stroke="currentColor" 
                        class="w-3.5 h-3.5"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              
              <!-- Resumen y formulario de cliente -->
              <div v-if="selectedSlot" class="mt-8 space-y-4">
                <!-- Mensaje de éxito -->
                <div v-if="appointmentSuccess" class="p-6 bg-green-50 border-2 border-green-500 rounded-xl text-center">
                  <div class="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-20 h-20 text-green-600">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-green-800 mb-2">¡Reserva Confirmada!</h3>
                  <p class="text-green-700 mb-2">{{ isAuthenticated ? 'Cita registrada en el sistema' : 'Hemos recibido tu reserva correctamente' }}</p>
                  <div v-if="!isAuthenticated" class="bg-white rounded-lg p-3 mt-4 space-y-2">
                    <p class="text-sm text-gray-700 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-green-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      Te hemos enviado un email de confirmación con todos los detalles
                    </p>
                    <p class="text-sm text-gray-700 flex items-center justify-center gap-2" v-if="clientPhone">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-green-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                      </svg>
                      También recibirás un SMS de recordatorio
                    </p>
                  </div>
                  <div v-else class="bg-white rounded-lg p-3 mt-4">
                    <p class="text-sm text-gray-700 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-purple-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      La cita ha sido añadida al sistema sin notificaciones
                    </p>
                  </div>
                </div>

                <!-- Resumen de reserva -->
                <div v-else class="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <h3 class="font-bold text-lg text-gray-800 mb-4">📋 Resumen de tu reserva</h3>
                  <div class="space-y-2 mb-6">
                    <p class="text-gray-700">
                      <span class="font-semibold">Servicio:</span> {{ selectedService.name }}
                    </p>
                    <p class="text-gray-700">
                      <span class="font-semibold">Fecha:</span> {{ new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                    <p class="text-gray-700">
                      <span class="font-semibold">Hora:</span> {{ selectedSlot }} ({{ selectedService.duration }} minutos)
                    </p>
                    <p class="text-gray-700">
                      <span class="font-semibold">Precio:</span> €{{ selectedService.price }}
                    </p>
                  </div>

                  <!-- Formulario de datos del cliente -->
                  <div v-if="!showClientForm">
                    <button
                      @click="isAuthenticated ? confirmAppointment() : openClientForm()"
                      :disabled="savingAppointment"
                      class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ savingAppointment ? 'Confirmando...' : 'Confirmar Reserva' }}
                    </button>
                  </div>

                  <div v-else class="space-y-4">
                    <!-- Mensaje para usuarios autenticados -->
                    <div v-if="isAuthenticated" class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 mb-4">
                      <div class="flex items-center justify-center gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-green-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                        <p class="text-green-800 font-bold">¡Sesión iniciada!</p>
                      </div>
                      <p class="text-sm text-green-700 text-center">
                        Tus datos han sido autocompletados. Puedes confirmar directamente.
                      </p>
                    </div>

                    <h4 v-else class="font-semibold text-gray-800 text-center mb-2">📝 Completa tus datos</h4>
                    
                    <div v-if="!isAuthenticated" class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p class="text-xs text-blue-800 text-center">
                        💌 Recibirás un email/SMS de confirmación con los detalles de tu cita
                      </p>
                    </div>
                    
                    <!-- Nombre -->
                    <div class="relative">
                      <input
                        v-model="clientName"
                        type="text"
                        id="client-name"
                        placeholder=" "
                        required
                        :readonly="isAuthenticated"
                        :class="[
                          'peer w-full px-4 py-3 border-2 rounded-xl outline-none transition-all',
                          isAuthenticated 
                            ? 'bg-gray-50 border-gray-300 text-gray-700 cursor-not-allowed' 
                            : 'border-purple-300 focus:ring-4 focus:ring-purple-200 focus:border-purple-500'
                        ]"
                      />
                      <label
                        for="client-name"
                        class="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-purple-600 peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
                      >
                        Nombre completo *
                      </label>
                    </div>

                    <!-- Teléfono -->
                    <div class="relative">
                      <input
                        v-model="clientPhone"
                        type="tel"
                        id="client-phone"
                        placeholder=" "
                        :readonly="isAuthenticated"
                        :class="[
                          'peer w-full px-4 py-3 border-2 rounded-xl outline-none transition-all',
                          isAuthenticated 
                            ? 'bg-gray-50 border-gray-300 text-gray-700 cursor-not-allowed' 
                            : 'border-purple-300 focus:ring-4 focus:ring-purple-200 focus:border-purple-500'
                        ]"
                      />
                      <label
                        for="client-phone"
                        class="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-purple-600 peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
                      >
                        Teléfono (opcional)
                      </label>
                    </div>

                    <!-- Email -->
                    <div class="relative">
                      <input
                        v-model="clientEmail"
                        type="email"
                        id="client-email"
                        placeholder=" "
                        :readonly="isAuthenticated"
                        :class="[
                          'peer w-full px-4 py-3 border-2 rounded-xl outline-none transition-all',
                          isAuthenticated 
                            ? 'bg-gray-50 border-gray-300 text-gray-700 cursor-not-allowed' 
                            : 'border-purple-300 focus:ring-4 focus:ring-purple-200 focus:border-purple-500'
                        ]"
                      />
                      <label
                        for="client-email"
                        class="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-purple-600 peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
                      >
                        Email (opcional)
                      </label>
                    </div>

                    <p class="text-xs text-gray-500 text-center">* Al menos un método de contacto es requerido</p>

                    <!-- Botones -->
                    <div class="flex gap-3">
                      <button
                        @click="cancelClientForm"
                        :disabled="savingAppointment"
                        class="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-400 transition-all disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        @click="confirmAppointment"
                        :disabled="savingAppointment"
                        class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
                      >
                        {{ savingAppointment ? 'Guardando...' : 'Confirmar' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="selectedDate" class="text-center py-10">
              <div class="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <p class="text-gray-500 text-lg">No hay horarios disponibles para esta fecha</p>
              <p class="text-gray-400 text-sm mt-2">Prueba con otro día</p>
            </div>

            <div v-else class="text-center py-10">
              <div class="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-purple-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                </svg>
              </div>
              <p class="text-gray-500 text-lg">Selecciona una fecha para ver los horarios disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const slug = route.params.slug;

const salon = ref(null);
const services = ref([]);
const loading = ref(true);

// Reserva
const selectedService = ref(null);
const selectedDate = ref(null);
const selectedSlot = ref(null);
const displaySlots = ref([]);
const allSlots = ref([]);
const scheduleData = ref(null);
const loadingSlots = ref(false);

// Formulario de cliente
const showClientForm = ref(false);
const clientName = ref('');
const clientPhone = ref('');
const clientEmail = ref('');
const savingAppointment = ref(false);
const appointmentSuccess = ref(false);

// Detectar si el usuario está autenticado
const authenticatedUser = ref(null);
const isAuthenticated = ref(false);

// Verificar autenticación al cargar
const checkAuthentication = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      authenticatedUser.value = user;
      isAuthenticated.value = true;
      
      // Autocompletar datos si está autenticado
      clientName.value = user.name || '';
      clientEmail.value = user.email || '';
      clientPhone.value = user.phone || '';
      
      console.log('✅ Usuario autenticado detectado:', user.email);
    } catch (e) {
      console.error('Error parseando usuario:', e);
    }
  }
};

function selectService(service) {
  selectedService.value = service;
  selectedDate.value = null;
  selectedSlot.value = null;
  displaySlots.value = [];
  showClientForm.value = false;
  appointmentSuccess.value = false;
}

function selectSlot(slot) {
  selectedSlot.value = slot;
  showClientForm.value = false;
}

function openClientForm() {
  showClientForm.value = true;
}

function cancelClientForm() {
  showClientForm.value = false;
  // No limpiar datos si está autenticado
  if (!isAuthenticated.value) {
    clientName.value = '';
    clientPhone.value = '';
    clientEmail.value = '';
  }
}

async function confirmAppointment() {
  // Si está autenticado, usar datos del usuario
  if (isAuthenticated.value) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    clientName.value = user.name || '';
    clientEmail.value = user.email || '';
    clientPhone.value = user.phone || '';
  }

  // Validar solo si no está autenticado
  if (!isAuthenticated.value && (!clientName.value || (!clientPhone.value && !clientEmail.value))) {
    alert('Por favor, completa tu nombre y al menos un método de contacto');
    return;
  }

  savingAppointment.value = true;
  try {
    console.log('📤 Creando cita...');
    const [hour, minute] = selectedSlot.value.split(':');
    const startDateTime = new Date(selectedDate.value);
    startDateTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

    const token = localStorage.getItem('token');
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` }
    } : {};

    const response = await axios.post(`/public/${slug}/appointments`, {
      clientName: clientName.value,
      clientPhone: clientPhone.value || null,
      clientEmail: clientEmail.value || null,
      serviceId: selectedService.value.id,
      startTime: startDateTime.toISOString(),
      isStaffBooking: isAuthenticated.value, // Flag para indicar que es un trabajador
    }, config);

    console.log('✅ Cita creada:', response.data);
    appointmentSuccess.value = true;
    
    // Limpiar formulario
    const clearDelay = isAuthenticated.value ? 2000 : 3000;
    setTimeout(() => {
      selectedService.value = null;
      selectedDate.value = null;
      selectedSlot.value = null;
      displaySlots.value = [];
      showClientForm.value = false;
      if (!isAuthenticated.value) {
        clientName.value = '';
        clientPhone.value = '';
        clientEmail.value = '';
      }
      appointmentSuccess.value = false;
    }, clearDelay);

  } catch (err) {
    console.error('❌ Error creando cita:', err);
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.error || 'Error al crear la cita');
    } else {
      alert('Error al crear la cita');
    }
  } finally {
    savingAppointment.value = false;
  }
}

// Obtener datos del salón y servicios
const fetchSalon = async () => {
  loading.value = true;
  try {
    console.log('📤 Cargando salón público con slug:', slug);
    const { data } = await axios.get(`/public/${slug}`);
    console.log('✅ Datos del salón recibidos:', data);
    salon.value = data.salon || data;
    services.value = data.services || [];
  } catch (err) {
    console.error('❌ Error cargando el salón:', err);
    if (axios.isAxiosError(err)) {
      console.error('❌ Respuesta del servidor:', err.response?.data);
    }
    salon.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  checkAuthentication(); // Verificar autenticación primero
  fetchSalon();
});

// Función para agrupar slots por turnos (ahora con objetos que tienen estado)
function groupSlotsByShifts(slots, schedules) {
  if (!schedules || schedules.length === 0) return [{ name: 'Horario Disponible', slots }];
  
  const groups = schedules.map((schedule) => {
    const [openHour, openMin] = schedule.opening.split(':').map(Number);
    const [closeHour, closeMin] = schedule.closing.split(':').map(Number);
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    const shiftSlots = slots.filter(slot => {
      const timeStr = slot.time || slot;
      const [hour, min] = timeStr.split(':').map(Number);
      const slotMinutes = hour * 60 + min;
      return slotMinutes >= openMinutes && slotMinutes < closeMinutes;
    });
    
    // Determinar nombre del turno
    let name = '';
    if (schedules.length === 1) {
      name = 'Todo el día';
    } else if (openHour < 14) {
      name = '🌅 Turno Mañana';
    } else {
      name = '🌆 Turno Tarde';
    }
    
    return {
      name,
      opening: schedule.opening,
      closing: schedule.closing,
      slots: shiftSlots,
    };
  }).filter(group => group.slots.length > 0);
  
  return groups;
}

// Cargar slots cuando cambia la fecha (solo si hay servicio seleccionado)
watch(selectedDate, async (newDate) => {
  if (!newDate || !selectedService.value) {
    displaySlots.value = [];
    scheduleData.value = null;
    return;
  }

  loadingSlots.value = true;
  try {
    console.log('📅 Cargando slots para fecha:', newDate, 'y servicio:', selectedService.value.name);
    const { data } = await axios.get(`/public/${slug}/slots`, {
      params: { 
        date: newDate,
        serviceId: selectedService.value.id,
        duration: selectedService.value.duration,
      },
    });
    console.log('✅ Slots cargados:', data);
    displaySlots.value = data.availableSlots || [];
    allSlots.value = data.allSlots || [];
    scheduleData.value = data.schedules || null;
  } catch (err) {
    console.error('❌ Error cargando slots:', err);
    if (axios.isAxiosError(err)) {
      console.error('❌ Respuesta del servidor:', err.response?.data);
    }
    displaySlots.value = [];
    allSlots.value = [];
    scheduleData.value = null;
  } finally {
    loadingSlots.value = false;
  }
});
</script>

<style scoped>
/* Estilos personalizados para el calendario desplegable */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

/* Estilizar el dropdown del calendario en navegadores Webkit/Chromium */
input[type="date"]::-webkit-datetime-edit {
  padding: 0;
}

input[type="date"]::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

input[type="date"]::-webkit-datetime-edit-text {
  color: #6b7280;
  padding: 0 0.2em;
}

input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
  color: #1f2937;
  font-weight: 500;
}

input[type="date"]::-webkit-datetime-edit-month-field:focus,
input[type="date"]::-webkit-datetime-edit-day-field:focus,
input[type="date"]::-webkit-datetime-edit-year-field:focus {
  background-color: #f3e8ff;
  color: #7c3aed;
  outline: none;
  border-radius: 0.25rem;
}

/* Estilos para el calendario desplegable (solo Chrome/Edge) */
input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

/* Mejorar contraste cuando está enfocado */
input[type="date"]:focus::-webkit-datetime-edit-month-field,
input[type="date"]:focus::-webkit-datetime-edit-day-field,
input[type="date"]:focus::-webkit-datetime-edit-year-field {
  background-color: #f3e8ff;
  color: #7c3aed;
}

/* Firefox - Estilos básicos */
input[type="date"]::-moz-focus-inner {
  border: 0;
  padding: 0;
}
</style>
