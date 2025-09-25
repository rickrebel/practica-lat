<script setup>
// import { computed, ref, onMounted } from 'vue'
import CommonTitle from "../components/web/CommonTitle.vue";
import AdaptativeVideoPlayer from "../components/AdaptativeVideoPlayer.vue";
import {computed} from "vue";
import { resizeImg } from '~/composables/storyblok_images.js'


// defineProps({ blok: Object });
const props = defineProps({
  blok: Object,
  columns_together: Boolean,
})

const space_class = computed(() => {
  let final_class = props.columns_together ? 'px-0' : 'px-2 px-sm-3'
  final_class += ` text-${props.blok.align_text || 'left'}`
  // if (props.blok.free_class)
  //   final_class += ` ${props.blok.free_class}`
  return final_class
})

const description3 = computed(() => {
  return renderRichText(props.blok.description2)
})

const description2 = computed(() => {
  let rich_text = renderRichText(props.blok.description2)
  if (!rich_text)
    return null
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse">')
  return rich_text
  // return renderRichText(props.blok.text)
})

const color_description = computed(() =>
    props.blok.color_description || 'black')

const variant_card = computed(() => {
  return props.blok.background_color2
    ? ['primary', 'secondary'].includes(props.blok.background_color2)
      ? 'flat'
      : 'text'
    : 'flat'
})

function orientToAlign(orient) {
  return orient === 'left' ? 'start' : orient === 'right' ? 'end' : 'center'
}

const final_align = computed(() => {
  return orientToAlign(props.blok.align_text)
})

const final_sm_align = computed(() => {
  return orientToAlign(props.blok.align_md)
})

const background_image = computed(() => {
  if (!props.blok.texture_back)
    return null

  const image_url = resizeImg(props.blok.texture_back, 400)
  return `url(${image_url})`
})

const blok_header = computed(() => {
  return {
    subheader: props.blok.title,
    color_title: props.blok.color_title,
    align_text: props.blok.align_text,
    align_md: props.blok.align_md,
    align_title: props.blok.align_title,
    is_indirect: true,
  }
})

</script>

<template>

  <v-col
    v-editable="blok"
    :cols="blok.cols"
    :sm="blok.sm || blok.md"
    :md="blok.md"
    class="py-0 _py-sm-3"
    :class="space_class"
    :order="blok.order || 1"
    :order-md="blok.order_md || 1"
    :order-sm="blok.order_sm || 1"
  >
    <v-card
      :variant="variant_card"
      :class="`${blok.free_class} text-${blok.align_text} text-sm-${blok.align_md}`"
      class="rounded-0 fill-height py-0 _py-sm-4"
      :style="`background-image: ${background_image}`"
      elevation="0"
      :color="blok.background_color2 || 'transparent'"
    >
<!--      <div-->
<!--        class="d-flex flex-column"-->
<!--        :class="{ 'justify-center' : blok.vertical_centered }"-->
<!--      >-->
        <v-img
          v-if="blok.media?.filename && !blok.video_hls_url"
          _contain
          dark
          :src="resizeImg(blok.media)"
          :max-height="blok.image_height || 300"
          class="mt-10 mb-6 px-3 px-sm-6"
          _style="object-fit: contain;"
        ></v-img>
        <CommonTitle
          v-if="blok.title"
          :blok="blok_header"
        />
        <AdaptativeVideoPlayer
          v-if="blok.video_hls_url"
          :video-url="blok.video_hls_url"
          :video-poster="blok.media?.filename"
        />
        <v-card-text v-if="description2" class="py-2 py-sm-4">
          <div
            class="text-text-1 text-sm-subtitle-1 _mt-2 _mt-sm-4 montse"
            v-html="description2"
          ></div>
        </v-card-text>
        <v-card-actions v-if="blok.buttons.length">
          <v-spacer></v-spacer>
          <StoryblokComponent
            v-for="blok in blok.buttons"
            :key="blok._uid"
            :blok="blok"
          ></StoryblokComponent>
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-card-text v-if="blok.contents?.length" class="py-2 py-sm-4">
          <StoryblokComponent
            v-for="blok in blok.contents"
            :key="blok._uid"
            :blok="blok"
          ></StoryblokComponent>
        </v-card-text>
<!--      </div>-->
    </v-card>
  </v-col>

</template>

<style scoped lang="scss">
.side-title{
  width: 50px;
  height: 8px;
}
.title-no-wrap{
  white-space: normal !important;
}
/* Textura-papel */
.paper-texture {
  _position: absolute;
  _width: 473px;
  _height: 843px;
  _left: 0px;
  _top: 227px;
  //background: url(-azul.jpg);
  background: url('~/assets/textura-papel.png');
  //background-size: cover;
}


</style>