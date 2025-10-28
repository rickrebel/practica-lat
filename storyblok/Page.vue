<script setup>
defineProps({ blok: Object })

// add name to the component

</script>

<template>
  <v-card
    :color="blok.background_color?.color || 'transparent'"
  >

    <v-row
      class="ma-0"
      :class="blok.paper_texture ? 'paper-texture' : ''"
    >
      <StoryblokComponent
        v-for="blok in blok.body"
        :key="blok._uid"
        :blok="blok"
      ></StoryblokComponent>
    </v-row>
  </v-card>
</template>

<style lang="scss">
@use '../assets/css/utils.scss' as *;

</style>