<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
const { xs, smAndUp } = useDisplay()
import { resizeImg } from '~/composables/storyblok_images.js'


const props = defineProps({
  blok: Object
})

const imgClass = computed(() => ({
  'py-2': xs.value,
  'py-4': smAndUp.value,
}))

const titleClass = computed(() =>
  `text-${xs.value ? 'h6' : 'h5'} mt-${xs.value ? '4' : '12'}`)
const titleStyle = computed(() => (
  { color: props.blok.title_color ? props.blok.title_color.color : '#512da8' }))
const subtitleStyle = computed(() => (
  { color: props.blok.subtitle_color ? props.blok.subtitle_color.color : '#f40000' }))
</script>

<template>
  <v-img
    v-editable="blok"
    :sssrc="props.blok.cover.filename"
    _src="resizeImg(props.blok.cover, 1300)"
    :min-height="props.blok.height * 0.68 || 300"
    _max-height="props.blok.height || 440"
    id="header2"
    :class="imgClass"
  >
    <v-row
      mb-1
      class="landing-max-width-section px-3"
      :class="props.blok.align_content"
    >
      <v-col cols="12" sm="7" md="6" class="px-6" order="1">
        <p
          class="font-weight-bold"
          :class="titleClass"
          :style="titleStyle"
        >
          <span
            :class="{ 'white-back': props.blok.back_text }"
          >
            {{ props.blok.title }}
          </span>
        </p>
        <p
          v-if="props.blok.explain"
          class="text-primary-darken-2 text-body-2"
          :style="subtitleStyle"
        >
          <span :class="{ 'white-back': props.blok.back_text }">
            {{ props.blok.explain }}
          </span>
        </p>
        <v-card-actions class="my-4">
          <v-spacer></v-spacer>
          <component
            v-for="blok2 in props.blok.call_block"
            :key="blok2._uid"
            v-editable="blok2"
            :blok="blok2"
            :is="blok2.component"
          ></component>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-col>
      <v-col
        cols="10"
        sm="5"
        md="6"
        order="2"
        offset="1"
        offset-sm="0"
        class="mb-sm-n6 mb-md-n12 mb-0"
      >
        <v-img
          v-editable="blok"
          :sssrc="blok.cover.filename"
          :src="resizeImg(blok.cover, 1300)"
          id="image-map"
        >
        </v-img>
      </v-col>
    </v-row>
  </v-img>
</template>

<style scoped lang="scss">
#header2 {
  background: rgb(0,127,169);
  background: linear-gradient(180deg, rgba(0,127,169,1) 0%,
      rgba(0,89,140,1) 30%, rgba(0,47,108,1) 100%);
}
.white-back {
  background: rgba(256, 256, 256, 0.15);
}
#image-map {
  background-size: contain;
}
</style>
