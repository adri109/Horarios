<template>
  <div class="h-screen flex overflow-hidden">
    <Sidebar :collapsed="isSidebarCollapsed" @toggle="isSidebarCollapsed = !isSidebarCollapsed" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />
      <div class="flex-1 overflow-auto p-4">
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
import { ref } from 'vue';
import Sidebar from './components/Sidebar_Element.vue';
import Header from './components/Header_Element.vue';

const isSidebarCollapsed = ref(false);
</script>
