<template>
  <img
    :src="logoSrc"
    :alt="altText"
    :class="[
      'brand-logo block w-auto max-w-full select-none object-contain object-left',
      sizeClass,
      isFullLogo ? 'max-w-[9.5rem] sm:max-w-[11rem] md:max-w-[12.5rem]' : '',
      $attrs.class,
    ]"
    decoding="async"
    draggable="false"
  />
</template>

<script>
export default { inheritAttrs: false };
</script>

<script setup>
import { computed } from 'vue';
import { BRAND, BRAND_LOGOS } from '@/config/branding';

const props = defineProps({
  variant: {
    type: String,
    default: 'fullOnDark',
    validator: (value) => Object.prototype.hasOwnProperty.call(BRAND_LOGOS, value),
  },
  size: {
    type: String,
    default: 'md',
  },
});

const logoSrc = computed(() => BRAND_LOGOS[props.variant] ?? BRAND_LOGOS.fullOnDark);

const altText = `${BRAND.appName} — logo`;

const isFullLogo = computed(
  () =>
    !['iconBlack', 'iconGradient', 'iconWhite', 'iconMark'].includes(props.variant)
);

const sizeClass = computed(() => {
  const isIconOnly = ['iconBlack', 'iconGradient', 'iconWhite', 'iconMark'].includes(
    props.variant
  );

  const sizes = isIconOnly
    ? {
        xs: 'h-6',
        sm: 'h-8',
        md: 'h-9',
        lg: 'h-10',
        xl: 'h-12',
      }
    : {
        xs: 'h-7',
        sm: 'h-8',
        md: 'h-9 md:h-10',
        lg: 'h-11 md:h-12',
        xl: 'h-12 md:h-14',
      };

  return sizes[props.size] ?? sizes.md;
});
</script>
