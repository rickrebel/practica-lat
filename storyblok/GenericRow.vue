<script setup>
import { computed } from 'vue'
const props = defineProps({
  blok: Object,
})
import { useDisplay } from "vuetify/framework";
import { needShow } from '~/composables/display.js'

const isClient = ref(false)
const display = useDisplay()

const columns_together = computed(() => {

  if (!isClient.value)
    return !props.blok.space_between
    // return "Not client"
  // return display.mdAndUp.value
  if (props.blok.space_between_size) {
    return !needShow(props.blok.space_between_size, display)
  }
  return !props.blok.space_between
})

onMounted(() => {
  isClient.value = true
})

const background_color = computed(() => {
  if (props.blok.texture_back)
    return null
  return props.blok?.background_color?.color || 'transparent'
})

</script>

<template>
  <v-col
    cols="12"
    class="px-0"
    :order="blok.order || 1"
    :order-md="blok.order_md || 1"
  >
    <v-sheet
      v-editable="blok"
      :color="background_color"
      style="min-width: 100%;"
      :class="blok.free_class"
      :style="`padding-top: ${blok.padding_top || 0}px; padding-bottom: ${blok.padding_bottom || 0}px;`"
    >
      <v-row
        class="_px-2 _px-sm-4 py-3"
        :no-gutters="columns_together"
      >
        <StoryblokComponent
          v-for="(column, index) in blok.columns"
          :key="column._uid"
          :blok="column"
          :index="index"
          :columns_together="columns_together"
        />
      </v-row>
    </v-sheet>
  </v-col>
</template>

<style scoped lang="scss">

</style>
