<script setup>
import { computed } from 'vue'
const props = defineProps({
  blok: Object,
})

const columns_together = computed(() => {
  return !props.blok.space_between
})

const background_color = computed(() => {
  if (props.blok.texture_back)
    return null
  if (props.blok.background_color_collection)
    return props.blok.background_color_collection
  return props.blok?.background_color?.color || 'transparent'
})

</script>

<template>
  <v-sheet
    v-editable="blok"
    :color="background_color"
    style="min-width: 100%;"
    _style="{backgroundImage: blok.texture_back ? `url(https://a.storyblok.com/f/327491/2550x3300/3994476a6e/fondo.png)` : ''}"
    :class="blok.free_class"
  >

    <v-row
      class="px-2 px-sm-4 py-3"
      :no-gutters="columns_together"
    >
      <StoryblokComponent
        v-for="column in blok.columns"
        :key="column._uid"
        :blok="column"
        :columns_together="columns_together"
      />
    </v-row>
  </v-sheet>
</template>

<style scoped lang="scss">

</style>
