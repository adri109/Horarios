<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
    <!-- Navbar -->
    <nav class="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-purple-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <span class="text-white text-xl font-bold">{{ brand.appName }}</span>
          </router-link>
          <div class="flex items-center gap-4">
            <router-link 
              to="/login" 
              class="text-white hover:text-white/80 transition-colors font-medium"
            >
              Iniciar Sesión
            </router-link>
            <router-link 
              to="/register" 
              class="bg-white text-purple-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              Comenzar Gratis
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
      <div class="text-center">
        <!-- Círculos decorativos -->
        <div class="absolute top-40 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div class="relative z-10">
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Gestiona tu Salón de Belleza<br />
            <span class="bg-gradient-to-r from-pink-300 to-yellow-300 text-transparent bg-clip-text">
              de forma Profesional
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Menos llamadas, menos citas perdidas, más control. Organiza tu agenda y recupera tiempo para tu negocio.
          </p>
          
          <div class="flex flex-col items-center gap-4">
            <router-link 
              to="/register" 
              class="bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 transform"
            >
              Crear Cuenta Gratis
            </router-link>
            <div class="flex gap-6 text-white/80 text-sm">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                No se requiere tarjeta
              </span>
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Cancela cuando quieras
              </span>
            </div>
          </div>

          <!-- Benefits -->
          <div class="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
            <div class="text-center">
              <div class="text-2xl font-bold text-white mb-2">Menos tiempo administrativo</div>
              <div class="text-white/80">Agenda más ordenada</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white mb-2">Menos citas perdidas</div>
              <div class="text-white/80">Seguimiento centralizado</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white mb-2">Más control diario</div>
              <div class="text-white/80">Operación más clara</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- What Section -->
    <div class="bg-white py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Qué hace esta app?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Una solución práctica diseñada para simplificar la gestión diaria de tu salón de belleza
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
            <div class="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Gestión de Citas</h3>
            <p class="text-gray-600 mb-3">
              Calendario inteligente para organizar citas, evitar conflictos y optimizar tu agenda. Notificaciones automáticas por email y WhatsApp.
            </p>
            <p class="text-purple-600 text-sm font-semibold">
              → Elimina las dobles reservas y olvídate del papel
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
            <div class="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Base de Clientes</h3>
            <p class="text-gray-600 mb-3">
              Mantén un historial completo de cada cliente, preferencias, visitas anteriores y estadísticas detalladas.
            </p>
            <p class="text-blue-600 text-sm font-semibold">
              → Conoce mejor a tus clientes y fidelízalos
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
            <div class="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Gestión de Personal</h3>
            <p class="text-gray-600 mb-3">
              Administra tu equipo con roles personalizados, permisos granulares y asignación de tareas específicas.
            </p>
            <p class="text-indigo-600 text-sm font-semibold">
              → Delega tareas sin perder el control
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
            <div class="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Servicios y Precios</h3>
            <p class="text-gray-600 mb-3">
              Catálogo completo de servicios con precios, duraciones y descripción. Fácil actualización y gestión.
            </p>
            <p class="text-pink-600 text-sm font-semibold">
              → Actualiza precios en segundos, no en horas
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
            <div class="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Control de Inventario (Próximamente)</h3>
            <p class="text-gray-600 mb-3">
              Módulo en preparación para gestionar stock de productos en una próxima versión.
            </p>
            <p class="text-green-600 text-sm font-semibold">
              → Ya visible en el panel como funcionalidad próxima
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
            <div class="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Informes y Analytics</h3>
            <p class="text-gray-600 mb-3">
              Dashboard con métricas clave, estadísticas de rendimiento y exportación de reportes en CSV.
            </p>
            <p class="text-yellow-600 text-sm font-semibold">
              → Toma decisiones basadas en datos reales
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Why Section -->
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Por qué esta app?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Porque entendemos los desafíos únicos de gestionar un salón de belleza
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Incrementa tus Ingresos</h3>
                <p class="text-gray-600">
                  Reduce las ausencias con recordatorios automáticos, optimiza tu agenda y aprovecha el marketing dirigido para fidelizar clientes.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-purple-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Ahorra Tiempo</h3>
                <p class="text-gray-600">
                  Centraliza tareas de agenda, seguimiento y confirmaciones para reducir carga administrativa diaria.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Mejora la Experiencia del Cliente</h3>
                <p class="text-gray-600">
                  Página pública de reservas 24/7, confirmaciones instantáneas y un historial personalizado hacen que tus clientes se sientan especiales.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-pink-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Seguro y Confiable</h3>
                <p class="text-gray-600">
                  Tus datos están protegidos con cifrado de nivel empresarial. Sistema multi-tenant que garantiza total aislamiento entre salones.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-yellow-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Accesible desde Cualquier Lugar</h3>
                <p class="text-gray-600">
                  Aplicación web responsive que funciona en cualquier dispositivo. Gestiona tu salón desde el ordenador, tablet o móvil.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-indigo-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Precio Justo y Transparente</h3>
                <p class="text-gray-600">
                  Sin costes ocultos. Comienza gratis y escala según tu negocio crece. Cancela cuando quieras, sin compromisos.
                </p>
              </div>
            </div>
          </div>

          <div class="relative space-y-8">
            <!-- Testimonio -->
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div class="flex items-start gap-4 mb-4">
                <svg class="w-10 h-10 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div>
                  <p class="text-gray-700 text-lg mb-4 italic">
                    "Desde que empecé a usar {{ brand.appName }}, reduje citas perdidas y recuperé tiempo cada semana. Ahora puedo centrarme en lo que realmente importa: mis clientes."
                  </p>
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      MC
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">María Contreras</p>
                      <p class="text-sm text-gray-600">Propietaria de Salón Elegancia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CTA Box -->
            <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
              <h3 class="text-3xl font-bold mb-6">¿Listo para transformar tu salón?</h3>
              <ul class="space-y-4 mb-8">
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Configuración en menos de 5 minutos</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sin compromiso</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Soporte incluido</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Datos seguros y protegidos</span>
                </li>
              </ul>
              <router-link 
                to="/register" 
                class="block w-full bg-white text-purple-600 text-center px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Crear Cuenta Gratis →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Para quién es Section -->
    <div class="bg-white py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Para quién es {{ brand.appName }}?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Diseñado para profesionales que buscan crecer y optimizar su negocio
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Peluquerías -->
          <div class="text-center p-6">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-purple-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Peluquerías</h3>
            <p class="text-gray-600">Gestiona cortes, coloración y tratamientos capilares</p>
          </div>

          <!-- Barberías -->
          <div class="text-center p-6">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Barberías</h3>
            <p class="text-gray-600">Organiza cortes masculinos y servicios de afeitado</p>
          </div>

          <!-- Centros de Estética -->
          <div class="text-center p-6">
            <div class="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-pink-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Centros de Estética</h3>
            <p class="text-gray-600">Controla tratamientos faciales, masajes y más</p>
          </div>

          <!-- Salones Multi-servicio -->
          <div class="text-center p-6">
            <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-indigo-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Con Uno o Varios Empleados</h3>
            <p class="text-gray-600">Escala desde un profesional hasta equipos grandes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Final -->
    <div class="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
          Únete a miles de salones que ya confían en nosotros
        </h2>
        <p class="text-xl text-white/90 mb-8">
          Comienza hoy mismo y lleva tu salón de belleza al siguiente nivel
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/register" 
            class="bg-white text-purple-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 transform"
          >
            Empezar Ahora - Es Gratis
          </router-link>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-bold text-lg mb-4">{{ brand.appName }}</h3>
            <p class="text-gray-400 text-sm">
              {{ brand.tagline }}
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Producto</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Características</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Precios</a></li>
              <li><router-link to="/tech-info" class="hover:text-white transition-colors">Documentación</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Soporte</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white">Privacidad</a></li>
              <li><a href="#" class="hover:text-white">Términos</a></li>
              <li><a href="#" class="hover:text-white">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {{ currentYear }} {{ brand.appName }}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { BRAND } from '@/config/branding';

export default {
  name: 'LandingPage',
  data() {
    return {
      brand: BRAND,
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>
