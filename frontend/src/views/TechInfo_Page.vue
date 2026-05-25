<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
    <!-- Navbar -->
    <nav class="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <span class="text-white font-bold text-xl">Sistema de Gestión de Salones</span>
          </div>
          <router-link 
            to="/login" 
            class="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Iniciar Sesión
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
        <h1 class="text-6xl font-bold mb-6">Información Técnica</h1>
        <p class="text-2xl text-white/90 max-w-3xl mx-auto">
          Arquitectura moderna, escalable y en tiempo real para la gestión integral de salones de belleza
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      
      <!-- Stack Tecnológico -->
      <section class="mb-16">
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 class="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
            </svg>
            Stack Tecnológico
          </h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Backend -->
            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                </svg>
                Backend
              </h3>
              <ul class="space-y-3 text-white/80">
                <li class="flex items-start gap-2">
                  <span class="text-green-300 font-bold">•</span>
                  <span><strong>Node.js</strong> + <strong>Express</strong> - Framework web minimalista</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-300 font-bold">•</span>
                  <span><strong>TypeScript</strong> - Tipado estático y mejor mantenibilidad</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-300 font-bold">•</span>
                  <span><strong>Prisma ORM</strong> - Gestión de base de datos type-safe</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-300 font-bold">•</span>
                  <span><strong>PostgreSQL</strong> - Base de datos relacional robusta</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-300 font-bold">•</span>
                  <span><strong>Socket.IO</strong> - Comunicación WebSocket en tiempo real</span>
                </li>
              </ul>
            </div>

            <!-- Frontend -->
            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
                Frontend
              </h3>
              <ul class="space-y-3 text-white/80">
                <li class="flex items-start gap-2">
                  <span class="text-blue-300 font-bold">•</span>
                  <span><strong>Vue 3</strong> - Framework progresivo y reactivo</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-300 font-bold">•</span>
                  <span><strong>Composition API</strong> - Lógica reutilizable y organizada</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-300 font-bold">•</span>
                  <span><strong>Vue Router</strong> - Navegación SPA con guards</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-300 font-bold">•</span>
                  <span><strong>Tailwind CSS</strong> - Diseño utility-first responsive</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-300 font-bold">•</span>
                  <span><strong>Axios</strong> - Cliente HTTP con interceptores</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Arquitectura -->
      <section class="mb-16">
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 class="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Arquitectura del Sistema
          </h2>
          
          <div class="space-y-6">
            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-xl font-semibold text-white mb-3">API RESTful</h3>
              <p class="text-white/80">
                Arquitectura cliente-servidor con endpoints bien definidos siguiendo principios REST. 
                Rutas organizadas por recursos (appointments, clients, workers, services) con controladores separados 
                para mantener la lógica de negocio desacoplada.
              </p>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-xl font-semibold text-white mb-3">Patrón Repository</h3>
              <p class="text-white/80">
                Capa de abstracción entre controladores y la base de datos. Los repositorios encapsulan 
                las queries de Prisma, facilitando testing y cambios futuros en la persistencia de datos.
              </p>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-xl font-semibold text-white mb-3">Middleware Chain</h3>
              <p class="text-white/80">
                Sistema de middlewares para autenticación JWT, verificación de permisos granulares y 
                validación de datos. Cada request pasa por una cadena de validaciones antes de llegar al controlador.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Características Clave -->
      <section class="mb-16">
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 class="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            Características Destacadas
          </h2>

          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#10b981" class="w-7 h-7">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Tiempo Real</h3>
              <p class="text-white/70 text-sm">
                WebSockets con Socket.IO para notificaciones instantáneas. Los trabajadores reciben 
                actualizaciones de citas sin necesidad de recargar la página.
              </p>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#3b82f6" class="w-7 h-7">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Seguridad JWT</h3>
              <p class="text-white/70 text-sm">
                Autenticación basada en tokens JWT con expiración. Contraseñas hasheadas con bcrypt 
                y validación de tokens en cada request protegido.
              </p>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#a855f7" class="w-7 h-7">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Roles & Permisos</h3>
              <p class="text-white/70 text-sm">
                Sistema granular de permisos por trabajador. Control de acceso a nivel de recurso 
                (clientes, personal, servicios, inventario, informes).
              </p>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#eab308" class="w-7 h-7">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Gestión Horarios</h3>
              <p class="text-white/70 text-sm">
                Sistema flexible de horarios con múltiples franjas por día. Soporte para días cerrados, 
                bloqueos temporales y validación de disponibilidad en tiempo real.
              </p>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div class="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#ec4899" class="w-7 h-7">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Marketing Integrado</h3>
              <p class="text-white/70 text-sm">
                Campañas de email y WhatsApp desde el panel. Plantillas predefinidas, segmentación 
                de clientes y seguimiento de estadísticas de envío.
              </p>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div class="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#6366f1" class="w-7 h-7">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Informes & Analytics</h3>
              <p class="text-white/70 text-sm">
                Dashboard con métricas clave: tasa de completación, ingresos por servicio, 
                clientes frecuentes. Exportación de datos a CSV para análisis externo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Deployment -->
      <section class="mb-16">
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 class="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
            </svg>
            Despliegue en la Nube
          </h2>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-2xl font-semibold text-white mb-4">API — api.timeit.es</h3>
              <p class="text-white/80 mb-4">
                Backend Node.js + Express. PostgreSQL (Supabase), migraciones Prisma al arranque
                y <code class="text-white/90">/health</code> para monitorización.
              </p>
              <div class="flex items-center gap-2 text-green-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-semibold">Producción</span>
              </div>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-2xl font-semibold text-white mb-4">Web — timeit.es</h3>
              <p class="text-white/80 mb-4">
                SPA Vue 3. Build con Vue CLI, <code class="text-white/90">VUE_APP_API_URL</code>
                apuntando a la API y rutas SPA para Vue Router.
              </p>
              <div class="flex items-center gap-2 text-green-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-semibold">Producción</span>
              </div>
            </div>
          </div>

          <div class="mt-6 bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 class="text-xl font-semibold text-white mb-3">CI/CD Pipeline</h3>
            <p class="text-white/80">
              Despliegue continuo desde GitHub main branch. Cada push ejecuta tests, build y deploy 
              automático. Zero-downtime deployments con health checks antes de activar la nueva versión.
            </p>
          </div>
        </div>
      </section>

      <!-- Seguridad -->
      <section>
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 class="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Seguridad
          </h2>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
                Autenticación
              </h3>
              <ul class="space-y-2 text-white/70 text-sm">
                <li>• JWT con expiración de 1 hora</li>
                <li>• Bcrypt hash con salt rounds configurables</li>
                <li>• Tokens de recuperación de contraseña temporales</li>
                <li>• Validación de tokens en cada request protegido</li>
              </ul>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Protección
              </h3>
              <ul class="space-y-2 text-white/70 text-sm">
                <li>• CORS configurado con whitelist de dominios</li>
                <li>• SQL injection prevention con Prisma ORM</li>
                <li>• XSS protection con sanitización de inputs</li>
                <li>• Rate limiting en endpoints críticos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- Footer -->
    <footer class="bg-white/5 backdrop-blur-md border-t border-white/20 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-white/70">
          Proyecto Fin de Grado - Sistema de Gestión de Salones de Belleza
        </p>
        <p class="text-white/50 text-sm mt-2">
          Desarrollado con Vue 3, Node.js, TypeScript y PostgreSQL
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No necesita lógica por ahora, es una página estática
</script>

<style scoped>
/* Animaciones suaves para hover effects */
.transition-colors {
  transition: background-color 0.3s ease;
}
</style>
