<script setup>
import {computed, ref} from 'vue'
import { resizeImg, transformImage } from '~/composables/storyblok_images.js'

// Props
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})

// Reactive data
const loading = ref(false)
const show_all = ref(false)

const biography = computed(() => {
  let rich_text = renderRichText(props.blok.biography)
  if (!rich_text)
    return '-'
  // rich_text = rich_text.replace(
  //     /<p>/g, '<p class="mt-2 mt-sm-4 montse">')
  return rich_text
  // return renderRichText(props.blok.text)
})

const short_biography = computed(() => {
  let bio = biography.value
  if (bio.length > 90) {
    bio = bio.slice(0, 90) + '...'
  }
  return bio
})

// Use the converted mixin as a composable
</script>

<template>
  <v-col cols="12" sm="6" lg="4" class="pa-3">
    <v-card
      v-editable="blok"
      color="black"
      variant="flat"
      tile
      min-height="200"
    >
      <v-row no-gutters style="min-height: 200px;">
        <v-col cols="6">
          <v-img
            v-if="blok.profile_img?.filename"
            :src="transformImage(blok.profile_img, 400, 400)"
            class="grey lighten-2"
            aspect-ratio="1"
            cover
            height="200"
          ></v-img>
        </v-col>
        <v-col cols="6" class="d-flex flex-column justify-space-around">
          <div>
            <div class="text-h6 text-sm-h5 font-weight-bold px-3">
              {{ blok.full_name }}
            </div>
            <div
              class="text-subtitle-1 px-3"
              style="line-height: 1.2 !important;"
            >
              {{ blok.position }}
            </div>
          </div>
          <div class="text-body-2 pa-3" v-html="short_biography">
          </div>

        </v-col>
      </v-row>


    </v-card>
  </v-col>
</template>