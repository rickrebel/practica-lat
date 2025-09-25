<script setup>
import { resizeImg } from '~/composables/storyblok_images.js'
const props = defineProps({
  blok: Object,
})

const final_height = computed(() => {
  return props.blok.height || 200
})

</script>

<template>
  <v-card
    v-editable="blok"
    border
    class="pt-3"
  >
    <v-card-title
      v-if="blok.title"
      class="text-subtitle-1 pl-12 text-primary font-weight-bold"
    >
      {{ blok.title }}
    </v-card-title>
    <v-row class="my-2">
      <v-col
        cols="auto"
        class="py-0 pl-12 pr-3 text-center shrink"
        align-self="center"
      >
        <v-img

          :src="resizeImg(blok.main_image, 0, final_height)"
          width="auto"
          :max-height="final_height"
        ></v-img>
<!--        <v-img-->
<!--          :max-height="final_height"-->
<!--          :aspect-ratio="1"-->
<!--          :src="resizeImg(blok.main_image, 0, 400)"-->
<!--        ></v-img>-->
      </v-col>
    </v-row>
    <v-card-text
      v-if="blok.footer"
      v-html="footer"
      class="text-body-2 font-weight-normal special-img text-grey text-darken-2 pl-12 pb-2"
    ></v-card-text>
    <v-row v-if="false">

      <v-col
        v-if="blok.title"
        cols="12"
        class="text-subtitle-1 pl-12 text-primary font-weight-bold"
      >
        {{ blok.title }}
      </v-col>
      <v-col
        cols="auto"
        class="py-0 pl-12 pr-3 text-center shrink"
        align="middle"
        align-self="center"
        :height="final_height"
      >
        <v-img
          _contain
          dark
          :src="resizeImg(blok.main_image, 0, final_height)"
        ></v-img>
      </v-col>
      <v-col
        cols="12"
        v-if="blok.footer"
        v-html="blok.footer"
        class="text-body-2 font-weight-normal special-img text-grey text-darken-2 pl-12"
      ></v-col>

    </v-row>
  </v-card>
</template>

<style scoped lang="scss">

</style>