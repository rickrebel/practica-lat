<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import {resizeImg} from "~/composables/storyblok_images.js";

const modules = [Navigation, Pagination, Autoplay, EffectCoverflow];

dayjs.locale('es')

// Props
const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

</script>

<template>

  <div class="my-swiper">
    <Swiper
      :modules="modules"
      :slides-per-view="1"
      :loop="true"
      :navigation="true"
      :pagination="false"
      :autoplay="{ delay: 3000, disableOnInteraction: true }"
    >
      <SwiperSlide
        v-for="photo in images"
        :key="photo._uid"
      >
        <v-card
          class="my-2 mx-2"
          _style="width: 100%;"
        >
          <v-img
            :aspect-ratio="1"
            :src="resizeImg(photo, 1200)"
            max-height="400"
            _max-width="480"
            cover
            class="contain"
          ></v-img>
        </v-card>
      </SwiperSlide>
    </Swiper>
  </div>

</template>

<style scoped>
.carousel-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
.my-swiper {
  max-width: 100%;
}

@media (max-width: 500px) {
  .my-swiper {
    max-width: 400px;
  }
}
@media (max-width: 600px) {
  .my-swiper {
    max-width: 400px;
  }
}
</style>
