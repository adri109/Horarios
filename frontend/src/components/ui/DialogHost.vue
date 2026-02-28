<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
import { useDialog } from '@/composables/useDialog';

const { dialogState, confirm, cancel } = useDialog();
</script>

<template>
  <div
    v-if="dialogState.isOpen"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4"
    @click="dialogState.variant === 'confirm' ? cancel() : null"
  >
    <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl" @click.stop>
      <h3 class="text-lg font-bold text-gray-900">{{ dialogState.title }}</h3>
      <p class="mt-3 whitespace-pre-line text-sm text-gray-600">{{ dialogState.message }}</p>

      <div class="mt-6 flex justify-end gap-2">
        <BaseButton
          v-if="dialogState.variant === 'confirm'"
          variant="secondary"
          size="sm"
          @click="cancel"
        >
          {{ dialogState.cancelText }}
        </BaseButton>
        <BaseButton variant="primary" size="sm" @click="confirm">
          {{ dialogState.confirmText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
