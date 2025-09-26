<script setup>
import { ref } from 'vue'
import { resizeImg } from '~/composables/storyblok_images.js'

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

// Use the converted mixin as a composable
</script>

<template>
  <v-card flat tile class="d-flex" v-editable="blok">
    <v-hover v-slot:default="{ hover }">
      <v-row no-gutters>
        <v-col cols="12">
          <v-img
            v-if="blok.profile_img?.filename"
            :src="resizeImg(blok.profile_img, 300)"
            aspect-ratio="1"
            class="grey lighten-2"
          ></v-img>
          <v-fade-transition>
            <v-overlay
              v-if="hover"
              absolute
              style="overflow: hidden; vertical-align: top;"
              color="#036358"
              class="text-body-2"
            >
              <div>{{ blok.biography.substr(0,300) }}</div>
            </v-overlay>
          </v-fade-transition>
        </v-col>
        <v-col cols="12" align-self="center">
          <div class="text-subtitle-1 primary--text font-weight-bold">
            {{ blok.full_name }}
          </div>
        </v-col>
      </v-row>
    </v-hover>
  </v-card>
</template>