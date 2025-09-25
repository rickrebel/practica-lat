<script setup>
import { resizeImg } from '~/composables/storyblok_images.js'
const props = defineProps({
  blok: Object,
  columns_together: Boolean,
})

const space_class = computed(() => {
  return props.columns_together ? 'px-0' : 'px-2 px-sm-3'
})

</script>

<template>
  <v-col
    v-editable="blok"
    :cols="blok.cols"
    :sm="blok.sm || blok.md"
    :md="blok.md"
    class="py-2 py-sm-3"
    :class="space_class"
    :order="blok.order || 1"
    :order-sm="blok.order_sm || 1"
    :order-md="blok.order_md || 1"
    _class="ml-3 pa-1 pa-sm-2 pa-md-3 grow pr-0 d-flex flex-column justify-center"
  >
    <v-img
      cover
      style="max-width: 100%; height: 100%;"
      :src="resizeImg(blok.image, 800)"
    ></v-img>
  </v-col>
</template>

<style scoped lang="scss">

</style>