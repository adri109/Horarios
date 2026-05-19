<script setup>
import { computed } from 'vue';
import { BRAND } from '@/config/branding';
import BrandLogo from '@/components/BrandLogo.vue';
import { getDashboardNavItems } from '@/composables/useDashboardNavigation';

const emit = defineEmits(['close']);

const items = computed(() => getDashboardNavItems());

function handleNavigate() {
  emit('close');
}

/** Rutas `d` por icono (uno o varios `<path>`) */
const ICON_PATHS = {
  panel: [
    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  ],
  calendar: ['M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
  clients: [
    'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  ],
  staff: [
    'M12 10.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm-7.5 9.75a7.5 7.5 0 0 1 12-6m-.75.75h4.5a.75.75 0 0 1 .75.75v4.5h-6v-4.5a.75.75 0 0 1 .75-.75Zm1.125 0V13.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5',
  ],
  services: [
    'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  ],
  inventory: ['M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'],
  reports: [
    'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  ],
  marketing: [
    'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  ],
  settings: [
    'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-1.054 3.31.826 2.28 2.47a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c1.054 1.543-.826 3.31-2.47 2.28a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543 1.054-3.31-.826-2.28-2.47a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-1.054-1.543.826-3.31 2.47-2.28.996.362 2.093-.16 2.572-1.065z',
    'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  ],
};

function pathsFor(icon) {
  return ICON_PATHS[icon] || ICON_PATHS.panel;
}
</script>

<template>
  <div
    class="mobile-nav-fs-root sidebar fixed inset-0 z-[100] flex max-h-[100dvh] min-h-0 flex-col overflow-hidden text-white shadow-none md:hidden"
    role="dialog"
    aria-modal="true"
    :aria-label="`Menú ${BRAND.appName}`"
  >
    <div class="mobile-nav-fs-inner flex min-h-0 flex-1 flex-col">
      <header
        class="flex shrink-0 items-center justify-between gap-3 border-b border-white/15 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]"
      >
        <router-link
          to="/dashboard/resume"
          class="min-w-0 transition-opacity hover:opacity-90"
          :aria-label="`${BRAND.appName} — ${BRAND.dashboardLabel}`"
          @click="handleNavigate"
        >
          <BrandLogo variant="fullWhite" size="sm" />
        </router-link>
        <button
          type="button"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 transition hover:bg-white/25 active:scale-[0.98]"
          aria-label="Cerrar menú"
          @click="emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-6 w-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <nav class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-5">
        <div class="mx-auto grid w-full max-w-lg gap-3">
          <router-link
            v-for="(item, index) in items"
            :key="item.to"
            :to="item.to"
            v-slot="{ navigate, href, isActive, isExactActive }"
            custom
          >
            <a
              :href="href"
              class="mobile-nav-btn group flex items-center gap-4 rounded-2xl px-4 py-4 text-lg font-semibold text-white shadow-lg ring-1 ring-white/10 transition hover:bg-white/15 hover:ring-white/25 active:scale-[0.99]"
              :class="[
                item.exact ? (isExactActive && 'mobile-nav-btn--active') : (isActive && 'mobile-nav-btn--active'),
              ]"
              :style="{ '--stagger': `${Math.min(index, 12) * 45}ms` }"
              @click.prevent="
                navigate();
                handleNavigate();
              "
            >
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/10 transition group-hover:bg-white/25">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    v-for="(d, pi) in pathsFor(item.icon)"
                    :key="pi"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="d"
                  />
                </svg>
              </span>
              <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5 shrink-0 text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </router-link>
        </div>
      </nav>

      <footer class="shrink-0 border-t border-white/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-xs text-white/55">
        Elige una sección para ir al panel
      </footer>
    </div>
  </div>
</template>

<style scoped>
.mobile-nav-fs-inner {
  animation: mobile-nav-fs-inner-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes mobile-nav-fs-inner-in {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.mobile-nav-btn {
  animation: mobile-nav-btn-pop 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--stagger, 0ms);
}

@keyframes mobile-nav-btn-pop {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-nav-btn--active {
  background: rgba(255, 255, 255, 0.22);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  outline: 2px solid rgba(255, 255, 255, 0.45);
  outline-offset: 0;
}
</style>
