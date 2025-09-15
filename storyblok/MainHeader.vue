<script setup>
import { ref, onMounted } from 'vue'
import { resizeImg, transformImage } from '~/composables/storyblok_images.js'
import {useDisplay} from "vuetify";
import CommonTitle from "../components/web/CommonTitle.vue";
const { xs, smAndUp, mdAndUp, smAndDown } = useDisplay()

const props = defineProps({
  blok: Object
})

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <v-parallax
    height="360"
    :src="resizeImg(blok.back_image, 1200)"
    id="header"
    :scale="0.9"
  >
<!--    :class="{-->
<!--      'py-4': xs,-->
<!--      'py-10': smAndUp-->
<!--    }"-->
    <div
      v-editable="blok"
      style="height: 100%;"
      class="d-flex flex-column justify-center"
    >
      <v-card

        class="landing-max-width-section text-center px-6 px-sm-16"
        color="transparent"
        elevation="0"
      >

        <CommonTitle
          :blok="blok"
        />

  <!--        <div class="d-flex flex-column">-->
  <!--          <div class="mb-auto">-->
  <!--            <p-->
  <!--              :class="{-->
  <!--                'display-1 mt-4': xs,-->
  <!--                'display-2 mt-8': smAndUp-->
  <!--              }"-->
  <!--            >-->
  <!--              <span class="_white-back font-weight-bold text-black">-->
  <!--                {{ blok.title1 }}-->
  <!--              </span>-->
  <!--            </p>-->
  <!--            <p-->
  <!--              style="color: #fc0a41;"-->
  <!--              :class="{-->
  <!--                'headline': xs,-->
  <!--                'display-1': smAndUp-->
  <!--              }"-->
  <!--            >-->
  <!--              <span class="white-back">-->
  <!--                {{ blok.title2 }}-->
  <!--              </span>-->
  <!--            </p>-->
  <!--          </div>-->
  <!--        </div>-->
      </v-card>
    </div>
  </v-parallax>
</template>

<style lang="scss" scoped>
.white-back {
  background: rgba(256, 256, 256, 0.15);
}
.white-back2 {
  background: rgba(13, 212, 225, .6);
}
</style>
