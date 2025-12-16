<script setup>
import { ref, onMounted } from 'vue';

const isFlipped = ref(false);

// Configuración de animaciones
const animationConfig = [
  { name: 'square square-1', delay: 0.2, delay_reverse: 2.0 },
  { name: 'triangle triangle-1', delay: 0.4, delay_reverse: 1.8 },
  { name: 'square square-2', delay: 0.6, delay_reverse: 1.6 },
  { name: 'square square-3', delay: 0.8, delay_reverse: 1.4 },
  { name: 'square square-4', delay: 1.0, delay_reverse: 1.2 },
  { name: 'triangle triangle-2', delay: 1.2, delay_reverse: 1.0 },
  { name: 'square square-5', delay: 1.4, delay_reverse: 0.8 },
  { name: 'square square-6', delay: 1.6, delay_reverse: 0.6 },
  { name: 'square square-7', delay: 1.8, delay_reverse: 0.4 },
];

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value;
};

// Auto-iniciar (opcional)
onMounted(() => {
  setTimeout(() => {
    isFlipped.value = true;
  }, 200);
});
</script>

<template>
  <div class="container">
    <div class="card-wrapper mt-n3" :class="{ flipped: isFlipped }">
      <div class="black-square"></div>
      <div
        v-for="item in animationConfig"
        :key="item.name"
        :class="['white-object', item.name]"
        :style="{ '--delay': `${item.delay}s` }"
      ></div>
    </div>

    <button @click="toggleFlip" class="btn">
      {{ isFlipped ? 'Contraer' : 'Desplegar' }}
    </button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  padding-left: 2rem;
}

.card-wrapper {
  position: relative;
  width: 16px;
  height: 16px;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.black-square {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: grey;
  z-index: 2;
}

.white-object {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: white;
  transition: transform 0.2s ease-in-out;
  transition-delay: var(--delay);
}

.square:nth-child(3n) {
  background-color: #00FF99;
}

.square:nth-child(3n-1) {
  background-color: #3BF4FB;
}

.square:nth-child(3n-2) {
  background-color: #FFD91F;
}

/* Cuadrados */
.square-1 {
  right: 16px;
  transform-origin: right center;
  transform: rotateY(90deg);
}

.square-2 {
  bottom: 16px;
  transform-origin: left center;
  transform: rotateY(90deg);
}

.square-3 {
  left: 16px;
  bottom: 16px;
  transform-origin: left center;
  transform: rotateY(90deg);
}

.square-4 {
  left: 16px;
  transform-origin: top center;
  transform: rotateX(90deg);
}

.square-5 {
  top: 16px;
  transform-origin: right center;
  transform: rotateY(90deg);
}

.square-6 {
  top: 16px;
  right: 16px;
  transform-origin: right center;
  transform: rotateY(90deg);
}

.square-7 {
  top: 32px;
  right: 16px;
  transform-origin: top center;
  transform: rotateX(90deg);
}

/* Triángulos */
.triangle-1 {
  width: 0;
  height: 0;
  background-color: transparent;
  bottom: 16px;
  right: 16px;
  border-left: 17px solid transparent;
  no-border-bottom: 17px solid white;
  border-bottom: 17px solid #00FF99;
  transform-origin: bottom;
  transform: rotateX(90deg);
}

.triangle-2 {
  width: 0;
  height: 0;
  background-color: transparent;
  top: 16px;
  left: 16px;
  border-right: 17px solid transparent;
  no-border-top: 17px solid white;
  border-top: 17px solid #FFD91F;
  transform-origin: top center;
  transform: rotateX(90deg);
}

/* Estado flipped - todas las transformaciones a 0 */
.card-wrapper.flipped .white-object {
  transform: rotate(0deg);
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #555;
}
</style>