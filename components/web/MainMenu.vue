<script setup>

import {useWebStore} from '~/store/web.ts'
import ButtonGroup from "~/components/web/ButtonGroup.vue";
const webStore = useWebStore()
const { query, params } = useRoute()
// const { calc_final_url } = useWebStore()
// const { global_config } = webStore
import { calcFinalUrl } from '~/composables/final_url.ts'

const props = defineProps({
  // main_collections: {
  //   type: Array,
  //   required: true,
  // },
  blok: {
    type: Object,
    required: false,
  },
  menu_drawer: {
    type: Boolean,
    required: true,
  },
})

const emits = defineEmits(['toggle-menu'])

const lang = computed(() => {
  if (query._storyblok_lang)
    return query._storyblok_lang
  return params.lang || 'es'
})

const main_blok = computed(() => {
  if (props.blok) return props.blok
  // console.log('global_config', webStore.global_config)
  const global_c = webStore.global_config
  // console.log('global_c', global_c)
  if (global_c && global_c.header && global_c.header.length > 0)
    return global_c.header[0]
  return {}
})

const final_buttons = computed(() => {
  // console.log('main_blok', main_blok.value.buttons)
  if (!main_blok.value)
    return []
  let buttons = main_blok.value.buttons || []
  return buttons.map(button => {
    return calcFinalUrl(button, lang.value)
    // const main_url = button.to.cached_url || button.to.url
    // button.main_url = main_url
    // button.is_external = button.to?.linktype === 'url'
    // if (button.is_external)
    //   return button
    // if (button.to.cached_url || button.to.url){
    //   const all_paths = main_url.split('/')
    //   const some_is_current_lang = all_paths.some(
    //     path => path === lang.value)
    //   if (!some_is_current_lang) {
    //     const sep = main_url.startsWith('/') ? '' : '/'
    //     button.main_url = `/${lang.value}${sep}${main_url}`
    //   }
    // }
    // return button
  })
})

const final_menu_drawer = computed({
  get() {
    return props.menu_drawer
  },
  set(value) {
    emits('toggle-menu', value)
  }
})

</script>

<template>
  <v-navigation-drawer
    v-model="final_menu_drawer"
    app
    temporary
    location="right"
    _floating
    mobile-breakpoint="960"
    tile
    color="black"
    width="300"
  >
    <v-list nav open-strategy="multiple" _active-class="text-primary">

      <v-list-item v-if="false">
        <template v-slot:prepend v-if="false">
          <v-icon>dashboard</v-icon>
        </template>
        <v-list-item-title class="text-h6">
          Menú
        </v-list-item-title>
        <v-list-item-subtitle v-if="false">
          (en desarrollo)
        </v-list-item-subtitle>
      </v-list-item>
      <v-divider color="white" opacity="1" thickness="2"></v-divider>
      <client-only>
        <template
          v-for="button in final_buttons"
          :key="button._uid"
        >
          <ButtonGroup
            v-if="button.component === 'ButtonMenu'"
            :button="button"
          />
          <v-list-item
            v-else
            :value="button._uid"
            exact
            :href="button.is_external ? button.main_url : undefined"
            :to="button.is_external ? undefined : button.main_url"
            :target="button.is_external ? '_blank' : undefined"
            xto="button.to.cached_url || button.to.url"
            :title="button.button_title"
            class="my-1"
          >
            <template v-slot:title>
              <div
                class="text-subtitle-1"
              >
                {{ button.button_title }}
              </div>
            </template>

            <template v-slot:prepend>
              <v-avatar
                v-if="button.image_icon?.filename"
                :size="26"
                tile
                class="mr-1"
              >
                <img
                  :src="button.image_icon.filename"
                  style="contain: content; max-width: 26px; max-height: 26px;"
                />
              </v-avatar>
              <v-icon
                v-else-if="button.icon"
                :icon="button.icon"
                size="30"
                :color="button.icon_color || 'white'"
                class="opacity-100 mr-n4"
              ></v-icon>
              <v-icon v-else size="28" icon="info"></v-icon>
            </template>

          </v-list-item>
          <v-divider color="white" opacity="1" thickness="2"></v-divider>
        </template>
      </client-only>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">

</style>