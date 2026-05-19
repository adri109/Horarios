<template>
  <div class="flex h-screen overflow-hidden bg-slate-50">
    <Transition name="mobile-nav-fs">
      <MobileNavFullscreen v-if="mobileNavOpen" @close="mobileNavOpen = false" />
    </Transition>

    <Sidebar :collapsed="isSidebarCollapsed" @toggle="isSidebarCollapsed = !isSidebarCollapsed" />

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <Header @open-mobile-nav="mobileNavOpen = true" />
      <div class="flex-1 overflow-auto p-3 sm:p-4">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Sidebar from './components/Sidebar_Element.vue';
import Header from './components/Header_Element.vue';
import MobileNavFullscreen from './components/MobileNavFullscreen.vue';

const isSidebarCollapsed = ref(false);
const mobileNavOpen = ref(false);

watch(mobileNavOpen, (open) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = open ? 'hidden' : '';
});

function closeMobileNavIfDesktop() {
  if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
    mobileNavOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('resize', closeMobileNavIfDesktop);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', closeMobileNavIfDesktop);
  document.body.style.overflow = '';
});
</script>

<style>
.mobile-nav-fs-enter-active,
.mobile-nav-fs-leave-active {
  transition: opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.mobile-nav-fs-enter-from,
.mobile-nav-fs-leave-to {
  opacity: 0;
}
</style>
