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
const dialog = ref(false)
const selected_member = ref(null)

const biography = computed(() => {
  let rich_text = renderRichText(props.blok.biography)
  if (!rich_text)
    return '-'
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mb-2 mb-sm-4">')
  return rich_text
  // return renderRichText(props.blok.text)
})

const short_biography = computed(() => {
  let bio = biography.value
  if (bio.length > 240) {
    bio = bio.slice(0, 240) + '...'
  }
  return bio
})

// Use the converted mixin as a composable
</script>

<template>
  <v-col cols="12" md="6" lg="4" class="pa-3">
    <v-card
      v-editable="blok"
      color="black"
      variant="flat"
      tile
      min-height="200"
    >
      <div style="min-height: 200px;" class="d-flex">
        <div style="min-width: 200px;">
          <v-img
            v-if="blok.profile_img?.filename"
            :src="transformImage(blok.profile_img, 300, 300)"
            class="grey lighten-2"
            aspect-ratio="1"
            cover
            height="200"
          ></v-img>
        </div>
        <v-card
          class="d-flex flex-column justify-space-around fade-out py-2"
          variant="flat"
          color="transparent"
          tile
          style="text-wrap: pretty; max-height: 200px; overflow: hidden;"
        >
          <div>
            <div class="text-subtitle-1 text-sm-h6 font-weight-bold px-3">
              {{ blok.full_name }}
            </div>
            <div
              class="text-subtitle-2 text-subtitle-sm-1 px-3 text-grey-lighten-1"
              style="line-height: 1.2 !important;"
            >
              {{ blok.position }}
            </div>
          </div>
          <div class="text-body-2 pa-3" v-html="biography">
          </div>
        </v-card>
        <div
          class="d-flex justify-center floating-btn"
        >
          <v-btn
            color="accent"
            variant="elevated"
            class="mt-n8"
            xsize="xs ? 'small' : 'default'"
            size="small"
            icon
            @click="dialog = true"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card style="overflow-y: auto;">
        <v-img
          v-if="blok.profile_img?.filename"
          :src="transformImage(blok.profile_img, 600, 360)"
          aspect-ratio="1"
          class="grey lighten-2 mt-n1"
          height="360"
          contain
        ></v-img>
        <v-card-title class="text-h5 text-sm-h4 ">
          {{ blok.full_name }}
        </v-card-title>
        <v-card-subtitle
          v-if="blok.position"
          class="text-subtitle-1 text-sm-h6 px-4 pb-0"
        >
          {{ blok.position }}

        </v-card-subtitle>
        <v-card-text class="pa-4 text-body-1" style="line-height: 1.4;">
          <div v-html="biography"></div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="elevated" color="accent" @click="dialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<style scoped lang="scss">

.fade-out {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: linear-gradient(to bottom, rgba(43, 72, 101, 0) 0%, rgb(0, 0, 0) 100%);
    pointer-events: none;
  }
}

.floating-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%);
}
  //margin-left: 200px;
  //width: calc(100% - 200px);
</style>