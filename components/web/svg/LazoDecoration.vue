<script setup>

import lazos from './lazos.json'

const props = defineProps({
  lazo_type: {
    type: String,
    required: false,
    default: 'lazo-1',
  },
  colorStart: {
    type: String,
    default: 'rgb(193,226,61)'
  },
  colorEnd: {
    type: String,
    default: 'rgb(255,107,107)'
  },
  // Duración de la animación en segundos
  animationDuration: {
    type: Number,
    default: 2
  }
})

// Referencia al path para la animación
const pathRef = ref(null)
const pathLength = ref(0)

const isAnimating = ref(false)

const cssAnimationDuration = computed(() => `${props.animationDuration}s`)

const lazoData = computed(() => {
  return lazos[props.lazo_type] || lazos['lazo-1']
})

onMounted(async () => {
  if (pathRef.value) {
    pathLength.value = pathRef.value.getTotalLength()

    await nextTick()

    isAnimating.value = true
  }
})

</script>

<template>
  <svg
    :viewBox="lazoData.viewBox"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    class="svg-decoration"
  >
    <path
      v-if="false"
      :d="lazoData.path"
      fill="none"
      stroke="rgb(193,226,61)"
      :stroke-width="`${lazoData.strokeWidth}px`"
      stroke-linecap="round"
    />
    <defs>
      <linearGradient id="lazo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" :stop-color="colorStart" />
        <stop offset="100%" :stop-color="colorEnd" />
      </linearGradient>
    </defs>

    <path
      ref="pathRef"
      :d="lazoData.path"
      fill="none"
      stroke="url(#lazo-gradient)"
      :stroke-width="`${lazoData.strokeWidth}px`"
      stroke-linecap="round"
      class="animated-path"
      :class="{ 'start-animation': isAnimating }"
      :style="{
        'stroke-dasharray': pathLength,
        'stroke-dashoffset': pathLength
        // animation: `drawLine ${animationDuration}s ease-out forwards`
      }"
    />
  </svg>
</template>

<style scoped lang="scss">

.svg-decoration {
  position: absolute;
  width: 100%;
  z-index: 0;
  overflow: hidden;
}

.animated-path {
  will-change: stroke-dashoffset;
}
// 6. La animación ahora se define en una clase separada
.animated-path.start-animation {
  // Usamos el v-bind para la duración dinámica
  animation: drawLine v-bind(cssAnimationDuration) ease-out forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

</style>