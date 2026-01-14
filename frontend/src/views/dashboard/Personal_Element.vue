<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Personal</h1>
        <p class="text-gray-600 mt-1">Gestiona tu equipo de trabajo</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
      >
        <span class="text-xl">+</span>
        Agregar Trabajador
      </button>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Total Personal</p>
            <p class="text-3xl font-bold mt-1">{{ workers.length }}</p>
          </div>
          <div class="text-5xl opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-12 h-12">
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.5 7.5 0 0115 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">Activos</p>
            <p class="text-3xl font-bold mt-1">{{ workers.length }}</p>
          </div>
          <div class="text-5xl opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-12 h-12">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">Roles</p>
            <p class="text-3xl font-bold mt-1">Trabajadores</p>
          </div>
          <div class="text-5xl opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-12 h-12">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="bg-white rounded-xl shadow-md p-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre o email..."
        class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      <p class="mt-4 text-gray-600">Cargando personal...</p>
    </div>

    <!-- Lista de trabajadores -->
    <div v-else-if="filteredWorkers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="worker in filteredWorkers"
        :key="worker.id"
        class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border-l-4 border-purple-500"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {{ worker.name ? worker.name.charAt(0).toUpperCase() : '?' }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">{{ worker.name || 'Sin nombre' }}</h3>
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                {{ worker.role }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-2 text-sm text-gray-600 mb-4">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span>{{ worker.email }}</span>
          </div>
          <div v-if="worker.phone" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            <span>{{ worker.phone }}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>{{ formatDate(worker.createdAt) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="openEditModal(worker)"
            class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            Editar
          </button>
          <button
            @click="confirmDelete(worker)"
            class="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else class="text-center py-12 bg-white rounded-xl shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-4 text-gray-300">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
      <p class="text-gray-600 text-lg">No se encontraron trabajadores</p>
    </div>

    <!-- Modal Crear/Editar Worker -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModals"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-purple-600">
            {{ showEditModal ? 'Editar Trabajador' : 'Nuevo Trabajador' }}
          </h3>
          <button @click="closeModals" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="showEditModal ? updateWorker() : createWorker()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="trabajador@ejemplo.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {{ showEditModal ? '(dejar vacío para mantener)' : '*' }}
            </label>
            <input
              v-model="formData.password"
              type="password"
              :required="!showEditModal"
              minlength="6"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              v-model="formData.phone"
              type="tel"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="+34 600 000 000"
            />
          </div>

          <!-- Permisos -->
          <div class="border-t pt-4 mt-4">
            <h4 class="font-semibold text-gray-700 mb-3">Permisos</h4>
            
            <div class="space-y-3">
              <!-- Clientes -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  Clientes
                </p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewClients" class="rounded">
                    Ver clientes
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canEditClients" class="rounded">
                    Editar clientes
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canDeleteClients" class="rounded">
                    Eliminar clientes
                  </label>
                </div>
              </div>

              <!-- Personal -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                  Personal
                </p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewPersonal" class="rounded">
                    Ver personal
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canEditPersonal" class="rounded">
                    Editar personal
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canDeletePersonal" class="rounded">
                    Eliminar personal
                  </label>
                </div>
              </div>

              <!-- Servicios -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                  Servicios
                </p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewServices" class="rounded">
                    Ver servicios
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canEditServices" class="rounded">
                    Editar servicios
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canDeleteServices" class="rounded">
                    Eliminar servicios
                  </label>
                </div>
              </div>

              <!-- Inventario -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  Inventario
                </p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewInventory" class="rounded">
                    Ver inventario
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canEditInventory" class="rounded">
                    Editar inventario
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canDeleteInventory" class="rounded">
                    Eliminar inventario
                  </label>
                </div>
              </div>

              <!-- Citas -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Citas
                </p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canConfirmAppointments" class="rounded">
                    Confirmar citas
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canCancelAppointments" class="rounded">
                    Cancelar citas
                  </label>
                  <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    Completar y marcar "no asistió" siempre permitido
                  </p>
                </div>
              </div>

              <!-- Otros -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  Otros
                </p>
                <div class="space-y-1 ml-4">
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewReports" class="rounded">
                    Ver informes
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="formData.permissions.canViewMarketing" class="rounded">
                    Ver marketing
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje de error -->
          <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

          <!-- Mensaje de éxito -->
          <p v-if="formSuccess" class="text-green-600 text-sm flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {{ formSuccess }}
          </p>

          <button
            type="submit"
            class="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:shadow-lg transition disabled:opacity-50"
            :disabled="formLoading"
          >
            {{ formLoading ? 'Guardando...' : (showEditModal ? 'Actualizar' : 'Crear Trabajador') }}
          </button>
        </form>
      </div>
    </div>

    <!-- Modal Confirmar Eliminación -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">¿Eliminar trabajador?</h3>
          <p class="text-gray-600">
            ¿Estás seguro de que deseas eliminar a <strong>{{ workerToDelete?.name }}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            @click="deleteWorker"
            class="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            :disabled="formLoading"
          >
            {{ formLoading ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/utils/axios';
import { usePermissions } from '../../composables/usePermissions';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

// Verificar permisos
usePermissions('canViewPersonal');

// Estado
const workers = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const workerToDelete = ref(null);
const editingWorker = ref(null);

// Formulario
const formData = ref({
  email: '',
  password: '',
  name: '',
  phone: '',
  permissions: {
    canViewClients: true,
    canEditClients: false,
    canDeleteClients: false,
    canViewPersonal: false,
    canEditPersonal: false,
    canDeletePersonal: false,
    canViewServices: true,
    canEditServices: false,
    canDeleteServices: false,
    canViewInventory: false,
    canEditInventory: false,
    canDeleteInventory: false,
    canViewReports: false,
    canViewMarketing: false,
    canConfirmAppointments: false,
    canCancelAppointments: false,
  },
});
const formLoading = ref(false);
const formError = ref('');
const formSuccess = ref('');

// Computed
const filteredWorkers = computed(() => {
  if (!searchQuery.value) return workers.value;
  
  const query = searchQuery.value.toLowerCase();
  return workers.value.filter(w => 
    w.name?.toLowerCase().includes(query) || 
    w.email.toLowerCase().includes(query) ||
    w.phone?.includes(query)
  );
});

// Cargar trabajadores
const loadWorkers = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/workers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    workers.value = response.data.workers || [];
  } catch (error) {
    console.error('Error al cargar trabajadores:', error);
    if (error.response?.status === 403) {
      console.error('❌ Acceso denegado: solo administradores');
    }
  } finally {
    loading.value = false;
  }
};

// Crear trabajador
const createWorker = async () => {
  formLoading.value = true;
  formError.value = '';
  formSuccess.value = '';

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/workers`, formData.value, {
      headers: { Authorization: `Bearer ${token}` }
    });

    workers.value.push(response.data.worker);
    formSuccess.value = 'Trabajador creado exitosamente';
    
    setTimeout(() => {
      closeModals();
    }, 1500);
  } catch (error) {
    formError.value = error.response?.data?.error || 'Error al crear trabajador';
  } finally {
    formLoading.value = false;
  }
};

// Abrir modal de edición
const openEditModal = (worker) => {
  editingWorker.value = worker;
  formData.value = {
    email: worker.email,
    password: '',
    name: worker.name || '',
    phone: worker.phone || '',
    permissions: {
      canViewClients: worker.canViewClients || false,
      canEditClients: worker.canEditClients || false,
      canDeleteClients: worker.canDeleteClients || false,
      canViewPersonal: worker.canViewPersonal || false,
      canEditPersonal: worker.canEditPersonal || false,
      canDeletePersonal: worker.canDeletePersonal || false,
      canViewServices: worker.canViewServices || false,
      canEditServices: worker.canEditServices || false,
      canDeleteServices: worker.canDeleteServices || false,
      canViewInventory: worker.canViewInventory || false,
      canEditInventory: worker.canEditInventory || false,
      canDeleteInventory: worker.canDeleteInventory || false,
      canViewReports: worker.canViewReports || false,
      canViewMarketing: worker.canViewMarketing || false,
      canConfirmAppointments: worker.canConfirmAppointments || false,
      canCancelAppointments: worker.canCancelAppointments || false,
    },
  };
  showEditModal.value = true;
};

// Actualizar trabajador
const updateWorker = async () => {
  formLoading.value = true;
  formError.value = '';
  formSuccess.value = '';

  try {
    const token = localStorage.getItem('token');
    const dataToSend = { ...formData.value };
    
    // No enviar password vacío
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    const response = await axios.put(
      `${API_URL}/workers/${editingWorker.value.id}`,
      dataToSend,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Actualizar en la lista
    const index = workers.value.findIndex(w => w.id === editingWorker.value.id);
    if (index !== -1) {
      workers.value[index] = response.data.worker;
    }

    formSuccess.value = 'Trabajador actualizado exitosamente';
    
    setTimeout(() => {
      closeModals();
    }, 1500);
  } catch (error) {
    formError.value = error.response?.data?.error || 'Error al actualizar trabajador';
  } finally {
    formLoading.value = false;
  }
};

// Confirmar eliminación
const confirmDelete = (worker) => {
  workerToDelete.value = worker;
  showDeleteModal.value = true;
};

// Eliminar trabajador
const deleteWorker = async () => {
  formLoading.value = true;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/workers/${workerToDelete.value.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    workers.value = workers.value.filter(w => w.id !== workerToDelete.value.id);
    showDeleteModal.value = false;
    workerToDelete.value = null;
  } catch (error) {
    console.error('Error al eliminar trabajador:', error);
  } finally {
    formLoading.value = false;
  }
};

// Cerrar modales
const closeModals = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingWorker.value = null;
  formData.value = {
    email: '',
    password: '',
    name: '',
    phone: '',
    permissions: {
      canViewClients: true,
      canEditClients: false,
      canDeleteClients: false,
      canViewPersonal: false,
      canEditPersonal: false,
      canDeletePersonal: false,
      canViewServices: true,
      canEditServices: false,
      canDeleteServices: false,
      canViewInventory: false,
      canEditInventory: false,
      canDeleteInventory: false,
      canViewReports: false,
      canViewMarketing: false,
      canConfirmAppointments: false,
      canCancelAppointments: false,
    },
  };
  formError.value = '';
  formSuccess.value = '';
};

// Formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Cargar al montar
onMounted(() => {
  loadWorkers();
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
