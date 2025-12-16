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
      cols="4"
      sm="3"
      md="2"
      lg="1"
      class="align-center justify-space-between text-center pa-4"
      xclass="`pa-${institution.padding || 4}`"
    >
      <a
        :href="institution.web_page?.url || ''"
        target="_blank"
        class="text-decoration-none d-flex align-center justify-center"
      >
        <v-img
          v-if="institution.logo?.filename"
          :src="resizeImg(institution.logo, 200)"
          :alt="`${institution.name}`"
          :max-height="blok.max_height || 120"
          :max-width="blok.max_width || 200"
          :class="{'black-and-white': blok.black_and_white}"
          :style="`max-width: ${institution.heigth_percent}%;`"
        ></v-img>
        <span
          v-else
          class="text-decoration-none text-black"
          style="text-underline-offset: 4em;"
        >
          {{ institution.name }}

        </span>
      </a>
      <client-only>
        <v-tooltip
          v-if="institution.name"
          activator="parent"
          location="bottom"
        >
          {{ institution.name }}
        </v-tooltip>
      </client-only>
    </v-col>
  </v-row>

</template>

<style scoped lang="scss">

:deep(.black-and-white) {
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

</style>