<script setup>
defineProps({ blok: Object })

// add name to the component

</script>

<template>
  <v-row class="ma-0" :class="blok.paper_texture ? 'paper-texture' : ''">
    <StoryblokComponent
      v-for="blok in blok.body"
      :key="blok._uid"
      :blok="blok"
    ></StoryblokComponent>
  </v-row>
</template>

<style scoped lang="scss">
.paper-texture {
  background-blend-mode: multiply;
  background: url('~/assets/textura-papel.png');
}
</style>