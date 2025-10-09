<script setup>
import {computed} from "vue";

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

const background_image = computed(() => {
  if (props.blok.texture_back)
    return `url(https://a.storyblok.com/f/327491/2550x3300/3994476a6e/fondo.png)`
  if (props.blok.ribbon)
    return "~/assets/lazo.svg"
  return null
})

const sheet_class = computed(() => {
  let final_class = ''
  if (props.blok.use_grandient)
    final_class += 'container-with-texture dynamic-background'
  if (props.blok.free_class)
    final_class += ` ${props.blok.free_class}`
  return final_class
})

</script>

<template>

  <v-col
    cols="12"
    v-editable="blok"
    class="pa-0 _mb-3"
    :order="blok.order || 1"
    :order-md="blok.order_md || 1"
  >
    <v-sheet
      :color="background_color"
      class="pt-4 pb-10 rounded-0"
      variant="flat"
      :style="`backgroundImage: ${background_image}`"
      :class="sheet_class"
    >
      <svg
        v-if="blok.use_grandient"
        class="texture-background"
      >
        <rect width="100%" height="100%" />
      </svg>
      <div class="content">
        <SectionHeader
          v-for="blok in blok?.headers"
          :key="blok._uid"
          :blok="blok"
        />
        <v-row
          v-if="blok.columns?.length"
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
        <v-row no-gutters>
          <StoryblokComponent
            v-for="comp in blok.components"
            :key="comp._uid"
            :blok="comp"
          />
        </v-row>
        <v-card-actions v-if="blok.buttons?.length" class="mt-6">
          <v-spacer></v-spacer>
          <StoryblokComponent
            v-for="button in blok.buttons"
            :key="button._uid"
            :blok="button"
          />
          <v-spacer></v-spacer>
        </v-card-actions>
      </div>
    </v-sheet>
  </v-col>
</template>

<style lang="scss">

</style>