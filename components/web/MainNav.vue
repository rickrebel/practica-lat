<script setup>

// import { ref } from 'vue'
import { useDisplay } from 'vuetify'
const { xs, mdAndUp, smAndDown } = useDisplay()
import { locales } from "~/composables/locales.js"

const cookieLang = useCookie('user_lang')

const props = defineProps({
  is_editable: Boolean,
})

const emits = defineEmits(['toggle-menu'])

//       logo: null, // require("@/assets/logo.png"),
// const logo = ref(null)
// const menu = ref(false)
// const font_size = computed(() => xs.value ? 12 : 14)

const locales_with_image_flag = computed(() => {
  console.log('cookieLang', cookieLang.value)
  return locales.map((loc) => {
    return {
      ...loc,
      flag_image: `/flags_80/${loc.flag}.webp`,
      is_current: cookieLang.value === loc.code,
    }
  })
})

</script>

<template>
  <v-app-bar
    app
    color="black"
    height="90"
    class="px-3"
  >
    <div
      class="app-width2 d-flex px-3 justify-space-between align-center mx-auto"
      style="width: 100%;"
    >
      <div class="d-flex">

        <router-link to="/" class="d-flex">
          <v-img
            src="~/assets/p-white.svg"
            _src="/logo_simple_white.png"
            :height="xs ? 60 : 60"
            :width="xs ? 60 : 60"
          />
        </router-link>

      </div>
      <v-spacer></v-spacer>
      <v-chip
        color="white"
        variant="flat"
        class="font-weight-bold px-5"
      >
        ES
        <v-avatar
          size="24"
          class="ml-2"
          rounded="sm"
        >
          <v-img
            src="@/assets/flags_80/mx.webp"
            alt="Es"
            width="24"
            max-width="24"
            aspect-ratio="1"
            contain
            max-height="15"
          >
          </v-img>
        </v-avatar>
        <v-icon
          v-if="false"
          size="16"
          class="ml-1"
          color="black"
        >
          expand_more
        </v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="locale in locales_with_image_flag"
              :key="locale.code"
              :value="locale.code"
              :title="locale.name"
              :class="locale.is_current ? 'font-weight-bold' : ''"
            >
              <template v-slot:prepend>
                <v-avatar
                  size="24"
                  class="mr-2"
                  rounded="sm"
                >
                  <v-img
                    _src="`~/assets/flags_80/${locale.flag}.webp`"
                    xsrc="require(`~/assets/flags_80/${locale.flag}.webp`)"
                    :src="locale.flag_image"
                    :alt="locale.flag"
                    width="24"
                    max-width="24"
                    aspect-ratio="1"
                    contain
                    max-height="15"
                  >
                  </v-img>
                </v-avatar>
              </template>

            </v-list-item>
          </v-list>
        </v-menu>
      </v-chip>
      <v-app-bar-nav-icon class="ml-4" @click="$emit('toggle-menu')">


      </v-app-bar-nav-icon>
    </div>
<!--    <template v-slot:append>-->
<!--      <v-app-bar-nav-icon></v-app-bar-nav-icon>-->
<!--    </template>-->

  </v-app-bar>
</template>

<style lang="scss">
  .header-xs{
    margin-left: -10px
  }
</style>
