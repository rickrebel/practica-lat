<script setup>

import {computed, ref} from "vue";
import {useWebStore} from "~/store/web.ts";

const webStore = useWebStore()
// Store setup and state
const { query } = useRoute()

const props = defineProps({
  button: Object,
})


let storyblok_lang = ref('es')
if (query._storyblok_lang){
  storyblok_lang.value = String(query._storyblok_lang)
  // console.log('storyblok_lang from query', storyblok_lang)
}
else {
  // storyblok_lang.value = 'es'
  // console.log('storyblok_lang default', storyblok_lang.value)
}


const first_element = computed(() => {
  return props.button.elements && props.button.elements.length > 0
    ? props.button.elements[0]
    : null
})

const final_items = computed(() => {
  // console.log('button', props.button)
  const first = first_element.value
  let items = []
  if (!webStore.all_projects || !webStore.all_agendas){
    return []
  }
  if (!first){
    return []
  }
  else if (first.agendas && first.agendas.length > 0){
    // console.log('all_agendas', webStore.all_agendas)
    items = webStore.all_agendas.filter(agenda =>
      first.agendas.includes(agenda.uuid))
  }
  else if (first.projects && first.projects.length > 0){
    // console.log('all_projects', webStore.all_projects)
    items = webStore.all_projects.filter(project =>
      first.projects.includes(project.uuid))
  }
  // console.log('final_items', items)
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
      >
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
    <v-list-item
      v-for="sub_coll in final_items"
      :key="sub_coll._uid"
      exact
      :title="sub_coll.name"
      :value="sub_coll._uid"
      :to="`/${storyblok_lang}/${sub_coll.full_slug}`"
      v-tooltip:left="sub_coll.name"
    ></v-list-item>
  </v-list-group>

</template>

<style scoped lang="scss">

</style>