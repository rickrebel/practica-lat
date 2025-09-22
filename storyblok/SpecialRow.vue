<script setup>
import {computed} from "vue";

const props = defineProps({
  blok: Object,
})

const columns_together = computed(() => {
  return !props.blok.space_between
})

const background_color = computed(() => {
  if (props.blok.texture_back)
    return null
  if (props.blok.background_color_collection)
    return props.blok.background_color_collection
  return props.blok?.background_color?.color || 'transparent'
})

const sheet_class = computed(() => {
  let final_class = ''
  if (props.blok.use_grandient)
    final_class += 'container-with-texture'
  if (props.blok.free_class)
    final_class += ` ${props.blok.free_class}`
  return final_class
})

</script>

<template>

  <v-col
    cols="12"
    v-editable="blok"
    class="pa-0 _mb-3"
  >
    <v-sheet
      :color="background_color"
      class="pt-4 pb-10 rounded-0"
      variant="flat"
      :style="{backgroundImage: blok.texture_back ? `url(https://a.storyblok.com/f/327491/2550x3300/3994476a6e/fondo.png)` : ''}"
      :class="sheet_class"
    >
      <div v-if="blok.use_grandient" class="gradient-layers">
        <div class="gradient-layer gradient-1"></div>
        <div class="gradient-layer gradient-2"></div>
        <div class="gradient-layer gradient-3"></div>
        <div class="gradient-layer gradient-4"></div>
        <div class="gradient-layer gradient-5"></div>
        <div class="gradient-layer gradient-6"></div>
      </div>
      <svg
        v-if="blok.use_grandient"
        class="texture-background"
      >
        <rect width="100%" height="100%" />
      </svg>
      <div class="content">
        <SectionHeader
          v-for="blok in blok?.headers"
          :key="blok._uid"
          :blok="blok"
        />
        <v-row
          v-if="blok.columns?.length"
          class="px-2 px-sm-4 py-3"
          :no-gutters="columns_together"
        >
          <StoryblokComponent
            v-for="column in blok.columns"
            :key="column._uid"
            :blok="column"
            :columns_together="columns_together"
          />
        </v-row>
        <StoryblokComponent
          v-for="comp in blok.components"
          :key="comp._uid"
          :blok="comp"
        />
        <v-card-actions v-if="blok.buttons?.length" class="mt-6">
          <v-spacer></v-spacer>
          <StoryblokComponent
            v-for="button in blok.buttons"
            :key="button._uid"
            :blok="button"
          />
          <v-spacer></v-spacer>
        </v-card-actions>
      </div>
    </v-sheet>
    <svg width="0" height="0" style="position:absolute;">
      <defs>
        <filter id="sandpaper-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </defs>
    </svg>
  </v-col>
</template>

<style scoped lang="scss">

.container-with-texture {
  position: relative;
  overflow: hidden;
  z-index: 3;
}

.gradient-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

// Capa base para cada gradiente
.gradient-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.gradient-1 {
  background:
    radial-gradient(ellipse at 0 0,
         rgba(255,255,255,1) 15%, rgba(255,255,255, 0) 35%),
    radial-gradient(ellipse at 95% 95%,
         rgb(246, 222, 80, 1) 20%, rgb(255, 217, 31, 0) 50%),
    radial-gradient(ellipse at 0 95%,
         rgb(0, 255, 153, 1) 30%, rgba(0, 255, 153, .2) 60%),
    radial-gradient(ellipse at 95% 5%,
         rgb(59, 244, 251, 1) 20%, rgb(59, 244, 251, 0) 70%);
  animation: fadeInOut1 12s ease-in-out infinite;
}

.gradient-2 {
  background:
    radial-gradient(ellipse at 70% 30%,
         rgba(255,255,255,1) 18%, rgba(255,255,255, 0) 40%),
    radial-gradient(ellipse at 20% 80%,
         rgb(246, 222, 80, 1) 25%, rgb(255, 217, 31, 0) 55%),
    radial-gradient(ellipse at 80% 70%,
         rgb(0, 255, 153, 1) 22%, rgba(0, 255, 153, .2) 50%),
    radial-gradient(ellipse at 30% 20%,
         rgb(59, 244, 251, 1) 25%, rgb(59, 244, 251, 0) 65%);
  animation: fadeInOut2 12s ease-in-out infinite;
}

.gradient-3 {
  background:
    radial-gradient(ellipse at 95% 10%,
         rgba(255,255,255,1) 20%, rgba(255,255,255, 0) 45%),
    radial-gradient(ellipse at 10% 50%,
         rgb(246, 222, 80, 1) 28%, rgb(255, 217, 31, 0) 60%),
    radial-gradient(ellipse at 90% 85%,
         rgb(0, 255, 153, 1) 25%, rgba(0, 255, 153, .2) 55%),
    radial-gradient(ellipse at 40% 30%,
         rgb(59, 244, 251, 1) 18%, rgb(59, 244, 251, 0) 75%);
  animation: fadeInOut3 12s ease-in-out infinite;
}

.gradient-4 {
  background:
    radial-gradient(ellipse at 90% 60%,
         rgba(255,255,255,1) 16%, rgba(255,255,255, 0) 38%),
    radial-gradient(ellipse at 5% 15%,
         rgb(246, 222, 80, 1) 22%, rgb(255, 217, 31, 0) 52%),
    radial-gradient(ellipse at 85% 90%,
         rgb(0, 255, 153, 1) 35%, rgba(0, 255, 153, .2) 65%),
    radial-gradient(ellipse at 25% 85%,
         rgb(59, 244, 251, 1) 24%, rgb(59, 244, 251, 0) 68%);
  animation: fadeInOut4 12s ease-in-out infinite;
}

.gradient-5 {
  background:
    radial-gradient(ellipse at 40% 80%,
         rgba(255,255,255,1) 22%, rgba(255,255,255, 0) 42%),
    radial-gradient(ellipse at 80% 25%,
         rgb(246, 222, 80, 1) 26%, rgb(255, 217, 31, 0) 56%),
    radial-gradient(ellipse at 15% 30%,
         rgb(0, 255, 153, 1) 28%, rgba(0, 255, 153, .2) 58%),
    radial-gradient(ellipse at 75% 75%,
         rgb(59, 244, 251, 1) 19%, rgb(59, 244, 251, 0) 72%);
  animation: fadeInOut5 12s ease-in-out infinite;
}

.gradient-6 {
  background:
    radial-gradient(ellipse at 10% 40%,
         rgba(255,255,255,1) 19%, rgba(255,255,255, 0) 39%),
    radial-gradient(ellipse at 85% 80%,
         rgb(246, 222, 80, 1) 23%, rgb(255, 217, 31, 0) 53%),
    radial-gradient(ellipse at 30% 10%,
         rgb(0, 255, 153, 1) 32%, rgba(0, 255, 153, .2) 62%),
    radial-gradient(ellipse at 90% 50%,
         rgb(59, 244, 251, 1) 21%, rgb(59, 244, 251, 0) 69%);
  animation: fadeInOut6 12s ease-in-out infinite;
}

// Animaciones de fade in/out para cada capa
@keyframes fadeInOut1 {
  0%, 12%, 88%, 100% { opacity: 1; }
  15%, 85% { opacity: 0; }
}

@keyframes fadeInOut2 {
  0%, 12% { opacity: 0; }
  15%, 27% { opacity: 1; }
  30%, 100% { opacity: 0; }
}

@keyframes fadeInOut3 {
  0%, 27% { opacity: 0; }
  30%, 47% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@keyframes fadeInOut4 {
  0%, 47% { opacity: 0; }
  50%, 62% { opacity: 1; }
  65%, 100% { opacity: 0; }
}

@keyframes fadeInOut5 {
  0%, 62% { opacity: 0; }
  65%, 77% { opacity: 1; }
  80%, 100% { opacity: 0; }
}

@keyframes fadeInOut6 {
  0%, 77% { opacity: 0; }
  80%, 88% { opacity: 1; }
  100% { opacity: 0; }
}


.texture-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* Lo ponemos en una capa base */
}

.texture-background rect {
  opacity: 0.82;
  filter: url(#sandpaper-filter);
}

.content {
  position: relative; /* Lo ponemos por encima del fondo */
  z-index: 6;
}

</style>