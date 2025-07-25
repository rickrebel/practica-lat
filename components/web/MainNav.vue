<script setup>
import {useWebStore} from '~/store/web.js'
const webStore = useWebStore()
import { storeToRefs } from 'pinia'
const { global_config } = storeToRefs(webStore)

// import { ref } from 'vue'
import { useDisplay } from 'vuetify'
const { xs, mdAndUp, smAndDown, mobile} = useDisplay()

const props = defineProps({
  blok: Object,
  is_editable: Boolean,
})

const main_menu = ref(false)

//       logo: null, // require("@/assets/logo.png"),
// const logo = ref(null)
// const menu = ref(false)
// const font_size = computed(() => xs.value ? 12 : 14)

const main_blok = computed(() => {
  if (props.blok) return props.blok
  // console.log('global_config 2', global_config.value)
  const global_c = global_config.value
  // console.log('global_c', global_c)
  if (global_c && global_c.header && global_c.header.length > 0)
    return global_c.header[0]
})

const final_buttons = computed(() => {
  if (!main_blok.value) return []
  // show the current route page
  let buttons = main_blok.value.buttons || []
  const path = useRoute().path
  // console.log('path', path)
  if (path !== '/' && path !== '/home') {
    // console.log("main_blok.buttons", main_blok.value.buttons)
    // console.log('Adding home button', buttons)
    const home_title = 'Inicio'
    const has_home_button = buttons.some(
        button => button.button_title === home_title)

    if (!has_home_button) {
      // console.log('Adding home button', buttons)
      buttons.splice(0, 0, {
        _uid: 'home',
        component: "SimpleButton",
        behavior: 'menu',
        button_title: home_title,
        link: '/',
        variant: 'text',
        style: 'text',
        color: 'primary',
        to: {
          "url": "/",
        },
      })
    }
  }
  return buttons

  // console.log("main_blok.buttons", main_blok.value.buttons)
})

</script>

<template>
  <v-app-bar
    color="white"
    height="70"
    class="_pt-4 d-flex align-center justify-space-between dfi-app-width"
    :extension-height="38"
    :extended="mdAndUp"
    _style="padding-left: 120px; padding-right: 120px;"
    :elevation="mdAndUp ? 0 : 1"
    style="margin-left: auto; margin-right: auto;"
  >
    <div
      class="_app-width2 d-flex align-center py-3 py-md-4 _header-app-width px-4"
      _style="width: 1024px; margin-left: auto; margin-right: auto;"
      style="width: 100%;"
    >

      <router-link to="/" _class="d-flex align-center">
        <v-img
          src="~/assets/logo_ibero.png"
          :height="xs ? 60 : 40"
          :width="xs ? 190 : 120"
        />
      </router-link>
      <v-spacer></v-spacer>
      <v-btn
        v-if="mobile"
        icon="menu"
        class="header-xs"
        @click.stop="main_menu = !main_menu"
        _class="text-primary"
      >
        <v-icon>menu</v-icon>
      </v-btn>
    </div>


    <template v-slot:extension v-if="mdAndUp && final_buttons.length">
      <div
        _style="width: 1024px; margin-left: auto; margin-right: auto;"
        style="width: 100%;"
      >
        <template v-if="mdAndUp">
          <v-divider></v-divider>

          <StoryblokComponent
            v-for="blok in final_buttons"
            :key="blok._uid"
            :blok="blok"
            fixed_size="default"
            fixed_variant="text"
            fixed_color="white"
          ></StoryblokComponent>
          <v-divider class="pb-0 pt-0"></v-divider>
        </template>
        <v-divider v-else class="mt-n5 pb-0 pt-0"></v-divider>
      </div>
    </template>
  </v-app-bar>
  <v-navigation-drawer
    v-model="main_menu"
    temporary
    width="280"
    mobile-breakpoint="960"
    class="header-app-width"
    :class="{ 'header-xs': xs }"
    :style="{ width: xs ? '100%' : '280px' }"
    :mini-variant="xs"
    :clipped="$vuetify.display.mdAndUp"
    :elevation="xs ? 0 : 1"
  >
    <v-list nav open-strategy="multiple">
      <v-list-item
        v-for="blok in final_buttons"
        :key="blok._uid"
        class="px-2"
      >
        <StoryblokComponent
          :blok="blok"
          fixed_size="default"
          fixed_variant="text"
          fixed_color="primary"
        ></StoryblokComponent>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as *;

  .header-xs{
    margin-left: -10px
  }
  .app-width2{
    margin-left: auto;
    margin-right: auto;
    max-width: 1024px;
    // responsive
    @media (max-width: 600px) {
      max-width: 100%;
    }
  }

.dfi-app-width {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

.header-app-width {
  width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

@media #{map.get($display-breakpoints, 'sm-and-down')} {
    .header-app-width {
        width: 440px;
    }
}
@media #{map.get($display-breakpoints, 'lg')} {
    .header-app-width {
        width: 1024px;
    }
}
@media #{map.get($display-breakpoints, 'md')} {
    .header-app-width {
        width: 1024px;
    }
}
</style>
