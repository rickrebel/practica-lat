<script setup>
import { resizeImg, transformImage } from '~/composables/storyblok_images.js'
import dayjs from "dayjs";
const props = defineProps({
  blok: Object,
})
import { useDisplay } from 'vuetify'
import CommonTitle from "~/components/web/CommonTitle.vue";
const { xs, mdAndUp } = useDisplay()


</script>

<template>
  <v-card
    v-if="blok"
    color="white"
    v-editable="blok"
    variant="flat"
    class="outlined-card"
    tile
  >
    <div class="d-flex _flex-no-wrap flex-column">
      <v-sheet
        v-if="blok.logo?.filename"
        class="full-height d-flex justify-center align-center"
      >
        <v-img
          :aspect-ratio="1"
          :src="resizeImg(blok.logo, 140)"
          max-height="240"
          cover
        ></v-img>
      </v-sheet>
      <div class="pt-6">
        <v-chip
          v-if="blok.is_assistance"
          color="secondary"
          class="font-weight-bold px-5 mx-3"
        >
          Asistencia técnica especializada
        </v-chip>
        <v-card-title
          class="text-h6 title-no-wrap pt-0 font-weight-bold montse mx-3"
        >
          {{ blok.name }}
        </v-card-title>
        <v-divider class="my-2" >
        </v-divider>
      </div>
      <Paragraph
        v-for="blok in blok.content"
        :key="blok._uid"
        :blok="blok"
      ></Paragraph>
    </div>
  </v-card>
</template>

<style scoped lang="scss">

.title-no-wrap{
  white-space: normal !important;
}

.white-outlined {
  border: 3px solid white !important;
}

.outlined-card {
  border: 1px solid #bbbbbb !important;
}


</style>