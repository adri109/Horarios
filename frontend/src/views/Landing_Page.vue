<template>
  <div class="landing-root min-h-screen bg-white text-gray-900">
    <!-- ============================== NAVBAR ============================== -->
    <header
      :class="[
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/70 shadow-sm'
          : 'bg-transparent border-b border-transparent',
      ]"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 md:h-20">
          <router-link to="/" class="flex items-center gap-3 group">
            <div
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105',
                scrolled
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-purple-500/30'
                  : 'bg-white text-purple-600 shadow-purple-900/20',
              ]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <span
              :class="[
                'text-xl font-bold tracking-tight transition-colors',
                scrolled ? 'text-gray-900' : 'text-white',
              ]"
            >
              {{ brand.appName }}
            </span>
          </router-link>

          <nav class="hidden md:flex items-center gap-8">
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              :class="[
                'text-sm font-medium transition-colors',
                scrolled
                  ? 'text-gray-600 hover:text-purple-600'
                  : 'text-white/80 hover:text-white',
              ]"
            >
              {{ link.label }}
            </a>
          </nav>

          <div class="flex items-center gap-2 sm:gap-3">
            <router-link
              to="/login"
              :class="[
                'hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                scrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10',
              ]"
            >
              Iniciar sesión
            </router-link>
            <router-link
              to="/register"
              :class="[
                'inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg',
                scrolled
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-500/30 hover:shadow-purple-500/50 hover:from-purple-700 hover:to-blue-700'
                  : 'bg-white text-purple-700 shadow-purple-900/20 hover:bg-gray-100',
              ]"
            >
              Comenzar gratis
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- ============================== HERO ============================== -->
    <section class="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 pt-32 md:pt-40 pb-24 md:pb-36">
      <!-- Decoración -->
      <div class="absolute -top-32 -left-24 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -right-24 w-[32rem] h-[32rem] bg-blue-400/25 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl"></div>
      <div class="absolute inset-0 bg-grid opacity-[0.07]"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-4xl mx-auto">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 animate-fade-down"
          >
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span class="text-white/90 text-sm font-medium">
              Plataforma activa · sin tarjeta de crédito
            </span>
          </div>

          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight animate-fade-up"
          >
            Gestiona tu salón
            <br class="hidden md:block" />
            <span class="bg-gradient-to-r from-pink-200 via-yellow-200 to-pink-300 text-transparent bg-clip-text">
              de forma profesional
            </span>
          </h1>

          <p
            class="text-lg md:text-2xl text-white/85 max-w-3xl mx-auto leading-relaxed mb-10 animate-fade-up-delay"
          >
            Menos llamadas, menos citas perdidas, más control. Organiza tu agenda,
            tu equipo y tus clientes desde un solo lugar.
          </p>

          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 animate-fade-up-delay-2"
          >
            <router-link
              to="/register"
              class="group inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-purple-900/30 hover:scale-[1.03] hover:shadow-purple-900/40 transition-all duration-200"
            >
              Crear cuenta gratis
              <svg
                class="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
            <a
              href="#features"
              class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/15 transition-all"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Ver cómo funciona
            </a>
          </div>

          <div class="flex flex-wrap justify-center gap-x-6 gap-y-3 text-white/80 text-sm animate-fade-up-delay-2">
            <span class="flex items-center gap-2">
              <CheckIcon /> No se requiere tarjeta
            </span>
            <span class="flex items-center gap-2">
              <CheckIcon /> Configuración en 5 minutos
            </span>
            <span class="flex items-center gap-2">
              <CheckIcon /> Cancela cuando quieras
            </span>
          </div>
        </div>

        <!-- Mockup decorativo del panel -->
        <div class="relative mt-16 md:mt-24 max-w-5xl mx-auto animate-fade-up-delay-3">
          <div class="absolute inset-x-0 -top-6 h-12 bg-gradient-to-b from-white/0 to-white/0"></div>
          <div
            class="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10 bg-white"
          >
            <!-- Top bar -->
            <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
              <span class="w-3 h-3 rounded-full bg-red-400"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span class="w-3 h-3 rounded-full bg-green-400"></span>
              <div class="ml-4 flex-1 h-6 rounded-md bg-white border border-gray-200 hidden sm:block"></div>
            </div>
            <!-- Mock dashboard -->
            <div class="grid grid-cols-12 gap-0 bg-gray-50">
              <!-- Sidebar -->
              <div class="hidden md:flex md:col-span-3 lg:col-span-2 flex-col gap-1.5 p-4 bg-gradient-to-b from-purple-700 to-indigo-700 text-white text-xs">
                <div class="font-bold text-sm mb-3">{{ brand.appName }}</div>
                <div class="px-2 py-1.5 rounded-md bg-white/15">Panel</div>
                <div class="px-2 py-1.5 rounded-md hover:bg-white/10">Citas</div>
                <div class="px-2 py-1.5 rounded-md hover:bg-white/10">Clientes</div>
                <div class="px-2 py-1.5 rounded-md hover:bg-white/10">Personal</div>
                <div class="px-2 py-1.5 rounded-md hover:bg-white/10">Servicios</div>
                <div class="px-2 py-1.5 rounded-md hover:bg-white/10">Informes</div>
              </div>
              <!-- Content -->
              <div class="col-span-12 md:col-span-9 lg:col-span-10 p-4 sm:p-6 space-y-4">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div
                    v-for="(stat, i) in mockStats"
                    :key="i"
                    class="rounded-xl bg-white border border-gray-200 p-3"
                  >
                    <div class="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">
                      {{ stat.label }}
                    </div>
                    <div class="text-lg font-bold text-gray-900 mt-1">
                      {{ stat.value }}
                    </div>
                    <div class="mt-1 text-[10px]" :class="stat.up ? 'text-green-600' : 'text-rose-600'">
                      {{ stat.up ? '▲' : '▼' }} {{ stat.change }}
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div class="lg:col-span-2 rounded-xl bg-white border border-gray-200 p-4 h-44">
                    <div class="flex items-center justify-between mb-3">
                      <div class="text-sm font-semibold text-gray-900">Ingresos · 7 días</div>
                      <div class="text-[10px] text-gray-500">Hoy</div>
                    </div>
                    <div class="flex items-end gap-2 h-24">
                      <div
                        v-for="(h, i) in mockBars"
                        :key="i"
                        class="flex-1 rounded-t-md bg-gradient-to-t from-purple-500 to-blue-500"
                        :style="{ height: h + '%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="rounded-xl bg-white border border-gray-200 p-4 h-44">
                    <div class="text-sm font-semibold text-gray-900 mb-3">Próximas citas</div>
                    <div class="space-y-2">
                      <div
                        v-for="(c, i) in mockAppointments"
                        :key="i"
                        class="flex items-center gap-2"
                      >
                        <div
                          class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center text-[10px] font-bold"
                        >
                          {{ c.initials }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="text-xs font-medium text-gray-900 truncate">
                            {{ c.name }}
                          </div>
                          <div class="text-[10px] text-gray-500 truncate">
                            {{ c.service }}
                          </div>
                        </div>
                        <div class="text-[10px] font-semibold text-purple-600">
                          {{ c.time }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Glow under mockup -->
          <div class="absolute inset-x-10 -bottom-6 h-10 bg-purple-900/40 blur-2xl rounded-full"></div>
        </div>
      </div>
    </section>

    <!-- ============================== TRUST / STATS ============================== -->
    <section class="bg-white py-16 md:py-20 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold mb-10">
          Diseñada para todo tipo de salones de belleza
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div
            v-for="(stat, i) in heroStats"
            :key="i"
            class="text-center group"
          >
            <div
              class="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-2 transition-transform group-hover:scale-105"
            >
              {{ stat.value }}
            </div>
            <div class="text-sm md:text-base text-gray-600 font-medium">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== FEATURES ============================== -->
    <section id="features" class="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span
            class="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4"
          >
            Funcionalidades
          </span>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p class="text-lg md:text-xl text-gray-600 leading-relaxed">
            Una solución completa diseñada para simplificar la gestión diaria de tu
            salón de belleza, sin curvas de aprendizaje complicadas.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="(feature, i) in features"
            :key="i"
            class="feature-card group relative p-7 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div
              class="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
              :class="feature.glow"
            ></div>
            <div class="relative">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-md"
                :class="feature.iconBg"
              >
                <span class="text-white" v-html="feature.icon"></span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600 leading-relaxed mb-4">
                {{ feature.description }}
              </p>
              <p class="text-sm font-semibold flex items-center gap-1.5" :class="feature.accent">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {{ feature.benefit }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================== HOW IT WORKS ============================== -->
    <section class="py-24 md:py-32 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span
            class="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4"
          >
            Cómo funciona
          </span>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Empieza en menos de 5 minutos
          </h2>
          <p class="text-lg md:text-xl text-gray-600">
            Tres pasos sencillos para tener tu salón funcionando online.
          </p>
        </div>

        <div class="relative grid md:grid-cols-3 gap-8 md:gap-6">
          <!-- Línea conectora -->
          <div
            class="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 rounded-full"
            aria-hidden="true"
          ></div>

          <div
            v-for="(step, i) in steps"
            :key="i"
            class="relative text-center px-2"
          >
            <div
              class="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6 ring-8 ring-white"
            >
              {{ i + 1 }}
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ step.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== WHY US ============================== -->
    <section class="py-24 md:py-32 bg-gradient-to-br from-gray-50 via-white to-purple-50/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span
            class="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-4"
          >
            Beneficios
          </span>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            ¿Por qué elegir {{ brand.appName }}?
          </h2>
          <p class="text-lg md:text-xl text-gray-600">
            Pensado para profesionales que quieren centrarse en sus clientes,
            no en la administración.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div class="space-y-6">
            <div
              v-for="(benefit, i) in benefits"
              :key="i"
              class="flex gap-4 group"
            >
              <div
                class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                :class="benefit.iconBg"
              >
                <span :class="benefit.iconColor" v-html="benefit.icon"></span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-1.5">
                  {{ benefit.title }}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  {{ benefit.description }}
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <!-- CTA Card -->
            <div
              class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8 md:p-10 text-white shadow-2xl shadow-purple-900/20"
            >
              <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
              <div class="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-pink-400/20 blur-3xl"></div>
              <div class="relative">
                <h3 class="text-2xl md:text-3xl font-bold mb-6">
                  ¿Listo para transformar tu salón?
                </h3>
                <ul class="space-y-3 mb-8">
                  <li
                    v-for="(item, i) in ctaPoints"
                    :key="i"
                    class="flex items-start gap-3"
                  >
                    <svg
                      class="w-5 h-5 mt-0.5 text-green-300 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.4"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-white/95">{{ item }}</span>
                  </li>
                </ul>
                <router-link
                  to="/register"
                  class="block w-full text-center bg-white text-purple-700 px-6 py-4 rounded-xl font-bold text-base hover:bg-gray-100 transition-all shadow-lg"
                >
                  Crear cuenta gratis →
                </router-link>
              </div>
            </div>

            <!-- Testimonio destacado -->
            <div class="rounded-3xl bg-white p-8 shadow-lg border border-gray-200">
              <div class="flex gap-1 mb-4">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.286 3.957c.3.92-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.175 0l-3.37 2.45c-.785.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              </div>
              <p class="text-gray-700 leading-relaxed mb-5 italic">
                "Desde que empecé a usar {{ brand.appName }}, reduje las citas
                perdidas y recuperé tiempo cada semana. Ahora puedo centrarme en
                lo que realmente importa: mis clientes."
              </p>
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                >
                  MC
                </div>
                <div>
                  <p class="font-bold text-gray-900">María Contreras</p>
                  <p class="text-sm text-gray-500">Propietaria de Salón Elegancia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== FOR WHO ============================== -->
    <section id="audience" class="py-24 md:py-32 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span
            class="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4"
          >
            Para quién es
          </span>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Hecho para tu negocio
          </h2>
          <p class="text-lg md:text-xl text-gray-600">
            Tanto si trabajas tú solo como si gestionas un equipo, {{ brand.appName }}
            se adapta a ti.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <article
            v-for="(target, i) in audiences"
            :key="i"
            class="text-center p-8 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
          >
            <div
              class="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg"
              :class="target.iconBg"
            >
              <span class="text-white" v-html="target.icon"></span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              {{ target.title }}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ target.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================== TESTIMONIALS ============================== -->
    <section class="py-24 md:py-32 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span
            class="inline-block px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider mb-4"
          >
            Testimonios
          </span>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Lo que dicen quienes ya lo usan
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <article
            v-for="(t, i) in testimonials"
            :key="i"
            class="rounded-3xl bg-white p-7 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex gap-1 mb-4">
              <svg
                v-for="n in 5"
                :key="n"
                class="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.286 3.957c.3.92-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.175 0l-3.37 2.45c-.785.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            </div>
            <p class="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">
              "{{ t.quote }}"
            </p>
            <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div
                class="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                :class="t.avatarBg"
              >
                {{ t.initials }}
              </div>
              <div>
                <p class="font-bold text-gray-900 text-sm">{{ t.name }}</p>
                <p class="text-xs text-gray-500">{{ t.role }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================== FAQ ============================== -->
    <section id="faq" class="py-24 md:py-32 bg-white">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span
            class="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4"
          >
            Preguntas frecuentes
          </span>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Resolvemos tus dudas
          </h2>
          <p class="text-lg text-gray-600">
            Si no encuentras lo que buscas, escríbenos y te respondemos lo antes posible.
          </p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, i) in faqs"
            :key="i"
            class="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:border-purple-200"
            :class="{ 'shadow-md border-purple-300': openFaq === i }"
          >
            <button
              type="button"
              @click="toggleFaq(i)"
              class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span class="font-semibold text-gray-900 text-base md:text-lg">
                {{ item.question }}
              </span>
              <span
                class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300"
                :class="{ 'rotate-45 bg-purple-100 text-purple-700': openFaq === i }"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
            </button>
            <div
              class="grid transition-all duration-300 ease-out"
              :class="openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
            >
              <div class="overflow-hidden">
                <p class="px-6 pb-5 text-gray-600 leading-relaxed">
                  {{ item.answer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== FINAL CTA ============================== -->
    <section class="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div class="absolute -top-24 -left-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -right-20 w-[28rem] h-[28rem] bg-blue-400/20 rounded-full blur-3xl"></div>
      <div class="absolute inset-0 bg-grid opacity-[0.07]"></div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
          Lleva tu salón al siguiente nivel
        </h2>
        <p class="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Empieza gratis hoy mismo. Sin tarjeta, sin compromiso, sin instalaciones.
          Solo abre {{ brand.appName }} y comienza a gestionar.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            to="/register"
            class="inline-flex items-center justify-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-base shadow-2xl hover:scale-[1.03] transition-all"
          >
            Empezar ahora — Es gratis
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
          <router-link
            to="/login"
            class="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/25 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/15 transition-all"
          >
            Ya tengo cuenta
          </router-link>
        </div>
      </div>
    </section>

    <!-- ============================== FOOTER ============================== -->
    <footer class="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-10 mb-12">
          <div class="md:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  class="w-6 h-6 text-white"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <span class="text-xl font-bold text-white">{{ brand.appName }}</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">
              {{ brand.tagline }}
            </p>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Producto
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li>
                <a href="#features" class="hover:text-white transition-colors">Características</a>
              </li>
              <li>
                <a href="#audience" class="hover:text-white transition-colors">Para quién es</a>
              </li>
              <li>
                <router-link to="/tech-info" class="hover:text-white transition-colors">
                  Documentación
                </router-link>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Soporte
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li><a href="#faq" class="hover:text-white transition-colors">Preguntas frecuentes</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Centro de ayuda</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-xs text-gray-500">
            © {{ currentYear }} {{ brand.appName }}. Todos los derechos reservados.
          </p>
          <p class="text-xs text-gray-500 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-400"></span>
            Todos los servicios operativos
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, h } from 'vue';
import { BRAND } from '@/config/branding';

const brand = BRAND;
const currentYear = new Date().getFullYear();

const scrolled = ref(false);
const openFaq = ref(0);

const handleScroll = () => {
  scrolled.value = window.scrollY > 24;
};

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? -1 : index;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Pequeño icono check inline (componente render fn)
const CheckIcon = () =>
  h(
    'svg',
    {
      class: 'w-4 h-4 text-green-300',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'stroke-width': '2.4',
    },
    [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M5 13l4 4L19 7',
      }),
    ],
  );

const navLinks = [
  { href: '#features', label: 'Características' },
  { href: '#audience', label: 'Para quién es' },
  { href: '#faq', label: 'Preguntas' },
];

const heroStats = [
  { value: '5 min', label: 'Configuración inicial' },
  { value: '24/7', label: 'Reservas online' },
  { value: '0 €', label: 'Para empezar' },
  { value: '100%', label: 'Datos cifrados' },
];

const mockStats = [
  { label: 'Ingresos hoy', value: '247 €', change: '+12%', up: true },
  { label: 'Citas hoy', value: '14', change: '+3', up: true },
  { label: 'Clientes nuevos', value: '5', change: '+2', up: true },
  { label: 'Cancelaciones', value: '1', change: '-2', up: false },
];

const mockBars = [40, 70, 55, 85, 65, 95, 80];

const mockAppointments = [
  { initials: 'AL', name: 'Ana López', service: 'Corte y peinado', time: '10:30' },
  { initials: 'MR', name: 'Marta Ruiz', service: 'Tinte completo', time: '12:00' },
  { initials: 'JS', name: 'Javier Sanz', service: 'Barba y corte', time: '13:45' },
];

const features = [
  {
    title: 'Gestión de citas',
    description:
      'Calendario inteligente para organizar citas, evitar conflictos y optimizar tu agenda. Con notificaciones automáticas por email.',
    benefit: 'Elimina dobles reservas y olvídate del papel',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-700',
    glow: 'bg-purple-300/40',
    accent: 'text-purple-600',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>',
  },
  {
    title: 'Base de clientes',
    description:
      'Historial completo de cada cliente, preferencias, visitas anteriores y estadísticas detalladas para personalizar la atención.',
    benefit: 'Conoce mejor a tus clientes y fidelízalos',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-700',
    glow: 'bg-blue-300/40',
    accent: 'text-blue-600',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>',
  },
  {
    title: 'Gestión de personal',
    description:
      'Administra tu equipo con roles personalizados, permisos granulares y asignación de tareas específicas a cada profesional.',
    benefit: 'Delega tareas sin perder el control',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    glow: 'bg-indigo-300/40',
    accent: 'text-indigo-600',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>',
  },
  {
    title: 'Servicios y precios',
    description:
      'Catálogo completo de servicios con precios, duraciones y descripción. Actualiza tarifas en segundos sin volver a imprimir nada.',
    benefit: 'Actualiza precios en segundos, no en horas',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    glow: 'bg-pink-300/40',
    accent: 'text-pink-600',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>',
  },
  {
    title: 'Reservas online 24/7',
    description:
      'Una página pública para tu salón donde tus clientes reservan a cualquier hora, incluso fuera del horario de apertura.',
    benefit: 'Recibe reservas mientras duermes',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    glow: 'bg-emerald-300/40',
    accent: 'text-emerald-600',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>',
  },
  {
    title: 'Informes y analíticas',
    description:
      'Dashboard con métricas clave, estadísticas de rendimiento y exportación de reportes en CSV para tomar decisiones reales.',
    benefit: 'Toma decisiones basadas en datos reales',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    glow: 'bg-amber-300/40',
    accent: 'text-amber-600',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>',
  },
];

const steps = [
  {
    title: 'Crea tu cuenta',
    description:
      'Regístrate en menos de un minuto, sin tarjeta de crédito ni instalaciones. Solo necesitas un email.',
  },
  {
    title: 'Configura tu salón',
    description:
      'Añade tus servicios, horarios, equipo y preferencias. Te guiamos paso a paso para que sea sencillo.',
  },
  {
    title: 'Empieza a gestionar',
    description:
      'Comparte tu enlace público y comienza a recibir reservas online mientras gestionas tu agenda diaria.',
  },
];

const benefits = [
  {
    title: 'Incrementa tus ingresos',
    description:
      'Reduce ausencias con recordatorios automáticos y aprovecha mejor cada hueco de tu agenda.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: '<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>',
  },
  {
    title: 'Ahorra tiempo',
    description:
      'Centraliza la gestión de citas, seguimiento y confirmaciones para reducir la carga administrativa diaria.',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    icon: '<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  },
  {
    title: 'Mejora la experiencia del cliente',
    description:
      'Página pública 24/7, confirmaciones instantáneas e historial personalizado para tus clientes.',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    icon: '<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>',
  },
  {
    title: 'Seguro y confiable',
    description:
      'Datos cifrados y arquitectura multi-tenant que garantiza el aislamiento total entre salones.',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    icon: '<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>',
  },
  {
    title: 'Accesible desde cualquier lugar',
    description: `Aplicación web responsive: usa ${brand.appName} desde el ordenador, la tablet o el móvil.`,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    icon: '<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>',
  },
  {
    title: 'Precio justo y transparente',
    description:
      'Sin costes ocultos. Empieza gratis y escala cuando crezcas. Cancela cuando quieras, sin compromisos.',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    icon: '<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>',
  },
];

const ctaPoints = [
  'Configuración en menos de 5 minutos',
  'Sin compromiso ni permanencia',
  'Soporte humano cuando lo necesites',
  'Tus datos siempre seguros y privados',
];

const audiences = [
  {
    title: 'Peluquerías',
    description: 'Gestiona cortes, coloración y tratamientos capilares con facilidad.',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-700',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>',
  },
  {
    title: 'Barberías',
    description: 'Organiza cortes masculinos, afeitados y cuidado de barba.',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-700',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>',
  },
  {
    title: 'Centros de estética',
    description: 'Controla tratamientos faciales, masajes y servicios corporales.',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>',
  },
  {
    title: 'Equipos grandes o solos',
    description: 'Escala desde un único profesional hasta equipos con varios empleados.',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>',
  },
];

const testimonials = [
  {
    quote:
      'En dos semanas teníamos toda la agenda online. Mis clientas reservan ellas mismas y yo dedico ese tiempo a peinar.',
    name: 'Lucía Hernández',
    role: 'Peluquería Lú · Sevilla',
    initials: 'LH',
    avatarBg: 'bg-gradient-to-br from-purple-600 to-pink-600',
  },
  {
    quote:
      'Las ausencias bajaron muchísimo desde que mandamos recordatorios automáticos. Es un cambio enorme para mi negocio.',
    name: 'David Romero',
    role: 'Barbería 7 · Madrid',
    initials: 'DR',
    avatarBg: 'bg-gradient-to-br from-blue-600 to-indigo-600',
  },
  {
    quote:
      'Tener todo el historial de mis clientas en un sitio me permite ofrecerles un trato mucho más personalizado.',
    name: 'Carolina Ibáñez',
    role: 'Centro Estética Glow · Valencia',
    initials: 'CI',
    avatarBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
  },
];

const faqs = [
  {
    question: '¿Necesito instalar algo en mi ordenador?',
    answer:
      'No, ' +
      brand.appName +
      ' es una aplicación 100% web. Funciona desde cualquier navegador en ordenador, tablet o móvil sin instalaciones ni descargas.',
  },
  {
    question: '¿Hay algún coste para empezar?',
    answer:
      'No. Puedes crear tu cuenta y empezar a gestionar tu salón gratis, sin tarjeta de crédito ni periodo de prueba limitado. Si más adelante necesitas funciones avanzadas, podrás escalar.',
  },
  {
    question: '¿Cómo gestiona la app las reservas online?',
    answer:
      'Cada salón obtiene una página pública única donde los clientes pueden reservar 24/7. Tú decides los horarios disponibles, servicios visibles y si las reservas requieren tu confirmación manual.',
  },
  {
    question: '¿Mis datos están seguros?',
    answer:
      'Sí. Toda la información se almacena cifrada y la arquitectura multi-tenant aísla por completo los datos de cada salón. Solo tú y tu equipo tenéis acceso a la información de tu negocio.',
  },
  {
    question: '¿Puedo dar acceso a mi equipo con permisos distintos?',
    answer:
      'Por supuesto. Como administrador puedes invitar a empleados con roles personalizables y permisos granulares: quién ve clientes, quién edita servicios, quién accede a informes, etc.',
  },
];
</script>

<style scoped>
/* Patrón de cuadrícula sutil para fondos oscuros */
.bg-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(
    ellipse at center,
    black 40%,
    transparent 80%
  );
}

/* Animaciones de entrada */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fade-down {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.7s ease-out both;
}
.animate-fade-up-delay {
  animation: fade-up 0.7s ease-out 0.15s both;
}
.animate-fade-up-delay-2 {
  animation: fade-up 0.7s ease-out 0.3s both;
}
.animate-fade-up-delay-3 {
  animation: fade-up 0.9s ease-out 0.45s both;
}
.animate-fade-down {
  animation: fade-down 0.6s ease-out both;
}

.landing-root {
  scroll-behavior: smooth;
  font-family: 'Poppins', sans-serif;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.4),
    rgba(59, 130, 246, 0.4)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.feature-card:hover::before {
  opacity: 1;
}
</style>
