<script setup>

import {useWebStore} from '~/store/web.ts'
import ButtonGroup from "~/components/web/ButtonGroup.vue";
const webStore = useWebStore()
// const { global_config } = webStore

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
  console.log('main_blok', main_blok.value)
  if (!main_blok.value) return []
  return main_blok.value.buttons || []
})

// const menu_drawer = ref(false)

</script>

<template>
  <v-navigation-drawer
    :model-value="menu_drawer"
    app
    temporary
    location="right"
    _floating
    mobile-breakpoint="960"
    tile
    color="black"
    width="280"
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
        >
          <ButtonGroup
            v-if="button.component === 'ButtonMenu'"
            :key="button._uid"
            :button="button"
          />
<!--          <v-list-group-->
<!--            v-if="button.component === 'ButtonMenu'"-->
<!--            :key="button._uid"-->
<!--            :value="button._uid"-->
<!--            soubgroup-->
<!--          >-->
<!--            <template v-slot:activator="{ props, isOpen }">-->
<!--              <v-list-item-->
<!--                v-bind="props"-->
<!--                exact-->
<!--                :title="button.button_title"-->
<!--                :prepend-icon="button.icon"-->
<!--              >-->
<!--              </v-list-item>-->
<!--            </template>-->
<!--            <v-list-item-->
<!--              v-for="sub_coll in button.elements[0].agendas"-->
<!--              :key="sub_coll"-->
<!--              exact-->
<!--              :title="sub_coll"-->
<!--              :value="sub_coll"-->
<!--              :to="`/dashboard/catalog/${sub_coll}`"-->
<!--            ></v-list-item>-->
<!--          </v-list-group>-->
          <v-list-item
            v-else
            :key="button._uid"
            :value="button._uid"
            exact
            :to="button.to.cached_url || button.to.url"
            :title="button.button_title"
          >
            <template v-slot:prepend>
              <v-avatar
                v-if="button.image_icon?.filename"
                :size="26"
                tile
              >
                <img
                  :src="button.image_icon.filename"
                  style="contain: content; max-width: 26px; max-height: 26px;"
                />
              </v-avatar>
              <v-icon
                v-else-if="button.icon"
                :icon="button.icon"
                size="26"
                style="opacity: 1"
              ></v-icon>
              <v-icon v-else size="26" icon="info"></v-icon>
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