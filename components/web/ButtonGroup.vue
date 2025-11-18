<script setup>

import {computed, ref} from "vue";
import {useWebStore} from "~/store/web.ts";

const webStore = useWebStore()
// Store setup and state
import { currentLocale } from "~/composables/locales.js"

const props = defineProps({
  button: Object,
})

const all_types = {
  "ProjectList": "project",
  "AxesList": "eje",
  "DocumentList": "document",
}

const first_element = computed(() => {
  return props.button.elements && props.button.elements.length > 0
    ? props.button.elements[0]
    : null
})

const current_type = computed(() => {
  const first = first_element.value
  // console.log('first', first)
  if (!first) return null
  // console.log('all_types', all_types)
  // console.log(all_types[first.component])
  return all_types[first.component] || null
})

const final_items = computed(() => {
  // console.log('button', props.button)
  const first = first_element.value
  let items = []
  if (!webStore.all_projects || !webStore.all_axes){
    return []
  }
  if (!first){
    return []
  }
  else if (first.axes && first.axes.length > 0){
    // console.log('all_axes', webStore.all_axes)
    items = first.axes.map(
      id => webStore.all_axes.find(a => a.uuid === id)
    ).filter(a => a)
  }
  else if (first.projects && first.projects.length > 0){
    // console.log('all_projects', webStore.all_projects)
    items = first.projects.map(
      id => webStore.all_projects.find(p => p.uuid === id)
    ).filter(p => p)
  }
  // console.log('items_menu', items)
  return items
})

</script>

<template>
  <v-list-group
    v-if="button.component === 'ButtonMenu'"
    :key="button._uid"
    :value="button._uid"
    soubgroup
  >
    <template v-slot:activator="{ props, isOpen }">
      <v-list-item
        v-bind="props"
        exact
        :title="button.button_title"
        class="text-h5 my-1"
      >
        <template v-slot:title>
          <div
            class="text-subtitle-1 pl-1"
          >
            {{ button.button_title }}
          </div>
        </template>
        <template v-slot:prepend>
          <v-avatar
            v-if="button.image_icon?.filename"
            size="26"
            tile
          >
            <v-img
              :src="button.image_icon.filename"
              contain
            ></v-img>
          </v-avatar>
          <v-icon
            size="26"
            v-else-if="button.icon"
            :icon="button.icon"
          ></v-icon>
          <v-icon v-else size="26" icon="info"></v-icon>
        </template>
      </v-list-item>
    </template>
    <div
      v-for="(sub_coll, index) in final_items"
      :key="sub_coll._uid"
      class="ml-11"
    >
      <v-divider
        xcolor="white"
        opacity="0.7"
        thickness="1"
      ></v-divider>
      <v-list-item
        exact
        nav
        :value="sub_coll._uid"
        variant="text"
        :to="`/${currentLocale}/${current_type}/${sub_coll.slug}`"
        v-tooltip:left="sub_coll.name"
        color="accent"
        class="my-1 ml-n14"
        style="min-width: 260px"
        slim
      >
        <template v-slot:title>
          <div
            class="text-wrap text-subtitle-2"
            style="max-width: 200px;"
          >
            {{ sub_coll.name }}
          </div>
        </template>
      </v-list-item>

    </div>
  </v-list-group>

</template>

<style scoped lang="scss">

</style>