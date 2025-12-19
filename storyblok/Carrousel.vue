<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'

import {useDisplay} from "vuetify";
const { mobile, xs } = useDisplay()

const isMounted = ref(false)

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import {resizeImg} from "~/composables/storyblok_images.js";

const modules = [Navigation, Pagination, Autoplay, EffectCoverflow];

dayjs.locale('es')

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

const max_height = computed(() => {
  if (!isMounted.value) return 400
  return xs.value
    ? 250
      : mobile.value
        ? 300
        : 400

})

const full_images = computed(() => {
  let all_images = props.images || []
  return all_images.reduce((final_imgs, img) => {
    const paths = img.filename.split('/')
    const size_path_regex = /\/\d+x\d+\//
    const size_path_index = paths.findIndex(
      path => size_path_regex.test(`/${path}/`))
    if (size_path_index !== -1) {
      const dimensions = paths[size_path_index].match(/\d+x\d+/)[0]
      const [width, height] = dimensions.split('x').map(Number)
      img.aspect_ratio = width / height
      const final_width = Math.round((max_height.value * width) / height)
      img.resized = resizeImg(img, final_width, max_height.value)
      img.final_width = final_width
      final_imgs.push(img)
    }
    return final_imgs
  }, [])
})

onMounted(() => {
  isMounted.value = true
})

</script>

<template>

  <div class="my-swiper">
    <Swiper
      :modules="modules"
      slides-per-view="auto"
      :loop="true"
      space-between="12"
      :navigation="true"
      :pagination="false"
      :autoplay="{ delay: 4500, disableOnInteraction: true }"
    >
      <SwiperSlide
        v-for="photo in full_images"
        :key="photo._uid"
        :style="`width: ${photo.final_width}px;`"
      >
        <v-img
          :aspect-ratio="photo.aspect_ratio"
          :src="resizeImg(photo, 0 , max_height * 1.5)"
          :max-height="max_height"
          cover
          class="contain"
        ></v-img>
      </SwiperSlide>
    </Swiper>
  </div>

</template>

<style scoped>
.my-swiper {
  max-width: 100%;
}

@media (max-width: 500px) {
  .not-my-swiper {
    max-width: 400px;
  }
}
</style>
