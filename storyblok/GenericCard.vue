<script setup>
// import { computed, ref, onMounted } from 'vue'
import CommonTitle from "../components/web/CommonTitle.vue";
import AdaptativeVideoPlayer from "../components/AdaptativeVideoPlayer.vue";
import {computed} from "vue";
import { resizeImg } from '~/composables/storyblok_images.js'
import { useDisplay } from 'vuetify';
const { sm, md } = useDisplay()


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

const card_class = computed(() => {
  //`${blok.free_class} text-${blok.align_text} text-sm-${blok.align_md}`

  const blok = props.blok
  let final_class = `text-${blok.align_text} text-sm-${blok.align_md}`
  if (blok.vertical_centered)
    final_class += ' d-flex align-center'
  if (blok.free_class)
    final_class += ` ${blok.free_class}`
  if (blok.background_color2)
    final_class += ' paper-texture'
  // if random number generated now
  // console.log("blok._uid", blok._uid)
  if (blok._uid) {
    const num = parseInt(blok._uid.replace(/\D/g, '').slice(-1)) // get last digit
    if (num % 4 === 0)
      final_class += ' effect-1'
    else if (num % 4 === 1)
      final_class += ' effect-2'
    else if (num % 4 === 2)
      final_class += ' effect-3'
  }

  return final_class
})

const description3 = computed(() => {
  return renderRichText(props.blok.description2)
})

const description2 = computed(() => {
  let rich_text = renderRichText(props.blok.description2)
  if (!rich_text)
    return null
  // console.log("rich_text", rich_text)
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse">')
  const shadow = "text-shadow: 1px 1px 4px rgba(0, 255, 133, 0.4)"
  rich_text = rich_text.replace(
      /<s>/g, `<span style="${shadow}">`)
  rich_text = rich_text.replace(/<s>/g, '</span>')
  return rich_text
  // return renderRichText(props.blok.text)
})

const color_description = computed(() =>
    props.blok.color_description || 'black')

const variant_card = computed(() => {
  return props.blok.background_color2
    ? ['primary', 'secondary', 'accent'].includes(props.blok.background_color2)
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
  >
    <v-card
      :variant="variant_card"
      :class="card_class"
      class="rounded-0 fill-height py-0"
      elevation="0"
      :color="blok.background_color2 || 'transparent'"
    >
      <v-row
        no-gutters
        align="stretch"
        :class="blok.space_between ? 'fill-height' : ''"
      >
        <v-col
          cols="12"
          :sm="blok.sm === '12' ? 4 : 12"
          md="12"
        >
          <CommonTitle
            v-if="blok.title && sm && blok.sm === '12'"
            :blok="blok_header"
          />
          <v-img
            v-if="blok.media?.filename && !blok.video_hls_url"
            _contain
            dark
            :src="resizeImg(blok.media, 800)"
            :max-height="blok.image_height || 300"
            class="mt-10 mb-6 px-3 px-sm-6"
            _style="object-fit: contain;"
          ></v-img>
          <CommonTitle
            v-if="blok.title && (!sm || blok.sm !== '12')"
            :blok="blok_header"
          />
          <AdaptativeVideoPlayer
            v-if="blok.video_hls_url"
            :video-url="blok.video_hls_url"
            :video-poster="blok.media?.filename"
          />
        </v-col>
        <template
          v-if="description2 || blok.buttons.length || blok.contents?.length"
        >
          <v-col
            cols="12"
            class="px-3 px-sm-6"
            v-if="blok.space_between && !(md && blok.sm === '12')"
          ></v-col>
          <v-col
            cols="12"
            :sm="blok.sm === '12' ? 8 : 12"
            md="12"
          >
            <v-card-text v-if="description2" class="py-2 py-sm-4">
              <div
                class="text-body-2 text-sm-body-1"
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
          </v-col>
        </template>
      </v-row>
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
  background-blend-mode: multiply;
  background: url('~/assets/textura-papel.png');
}

.shadow-phrases{
  background: linear-gradient(#eee, #333);
  filter: drop-shadow(2px 2px #333);
  color: #00FF99;
}

.effect-1 {
  background-position: bottom center;
  background-size: cover;
  position: relative; /* Necesario para posicionar el pseudoelemento */
  z-index: 1;
  overflow: hidden; /* Oculta partes del fondo que se salgan */
}

.effect-1::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1440px;
  height: 1440px;
  background-image: inherit;
  //background-color: rgba(164, 123, 123, 0.6);
  background-color: inherit;
  background-blend-mode: multiply;
  background-size: cover;
  background-position: center;
  z-index: -1;
  //transform: scale(-1, -1);
  transform: rotate(270deg);
}

.effect-2 {
  background-position: top left;
}

.effect-3 {
  background-position: top right;
}



</style>