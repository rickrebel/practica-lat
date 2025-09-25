<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')
import { resizeImg } from '~/composables/storyblok_images.js'

const props = defineProps({
  blok: Object
})

</script>

<template>
  <v-row
    justify="space-around"
    align="center"
    align-content="center"
    class="mx-3"
    v-editable="blok"
  >

    <v-col
      v-for="note in blok.notes"
      :key="note._uid"
      v-editable="note"
      cols="10"
      sm="6"
      md="4"
      class="align-center justify-space-between"
    >
      <v-card class="pb-4">
        <a :href="note.url?.url || ''" target="_blank">
          <v-img
            :src="resizeImg(note.cover, 350)"
            :alt="`Institución ${note}`"
            :max-height="blok.max_height || 160"
            :max-width="blok.max_width || 350"
            cover
          ></v-img>
        </a>
        <v-card-subtitle
          class="text-body-2 d-flex justify-space-between pt-3"
        >
          {{note.source}}
          <v-spacer></v-spacer>
          {{dayjs(note.date).format('DD/MMMM/YYYY')}}
        </v-card-subtitle>
        <a :href="note.url?.url || ''" target="_blank">
          <v-card-title
            class="text-info title-no-wrap text-subtitle-1 font-weight-bold lato"
            style="white-space: normal !important;"
          >
            {{note.title}}
          </v-card-title>
        </a>
        <v-tooltip
          v-if="note.subtitle"
          activator="parent"
          location="bottom"

        >
          <v-card max-width="300" color="transparent">


          {{ note.subtitle }}
          </v-card>
        </v-tooltip>

      </v-card>

    </v-col>
  </v-row>

</template>

<style scoped lang="scss">
.title-no-wrap{
  white-space: normal !important;
}

</style>
