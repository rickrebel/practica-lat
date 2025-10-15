<script setup>
import { resizeImg } from '~/composables/storyblok_images.js'

const props = defineProps({
  blok: Object
})

</script>

<template>
<!--  <SectionHeader-->
<!--    v-for="blok in blok?.header"-->
<!--    :key="blok._uid"-->
<!--    :blok="blok"-->
<!--  />-->
  <v-row
    justify="space-around"
    align="center"
    align-content="center"
    class="mx-3"
    v-editable="blok"
  >
    <v-col
      v-for="institution in blok.institutions"
      :key="institution._uid"
      v-editable="institution"
      cols="10"
      sm="6"
      md="4"
      class="pa-4 align-center justify-space-between text-center"
    >
      <a
        :href="institution.web_page?.url || ''"
        target="_blank"
        class="text-decoration-none d-flex align-center justify-center"
      >
        <v-img
          v-if="institution.logo?.filename"
          :src="resizeImg(institution.logo, 350)"
          :alt="`Institución ${institution}`"
          :max-height="blok.max_height || 120"
          :max-width="blok.max_width || 350"
        ></v-img>
        <span
          v-else
          class="text-decoration-none text-black"
          style="text-underline-offset: 4em;"
        >
          {{ institution.name }}

        </span>
      </a>
      <v-tooltip
        activator="parent"
        location="bottom"
      >
        {{ institution.name }}
      </v-tooltip>

    </v-col>
  </v-row>

</template>

<style scoped lang="scss">

</style>