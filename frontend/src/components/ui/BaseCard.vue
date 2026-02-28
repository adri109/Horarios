<script setup>
const props = defineProps({
  padded: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div :class="['ds-card', props.padded ? 'ds-card--padded' : '']">
    <slot />
  </div>
</template>
