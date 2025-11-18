<script setup>

import { watch } from 'vue'
import { useDisplay } from 'vuetify'
const { xs, mdAndUp, smAndDown } = useDisplay()
import { locales, currentLocale } from "~/composables/locales.js"
import AnimationLogo from "~/components/web/svg/AnimationLogo.vue";
import {useWebStore} from "~/store/web.js";
const { query, name, params } = useRoute()
const router = useRouter()
const webStore = useWebStore()
const cookieLang = useCookie('user_lang')

const props = defineProps({
  is_editable: Boolean,
  blok: {
    type: Object,
    required: false,
  },
})

import animatedLogo from '@/assets/animated_logo.gif';
import staticLogo from '@/assets/p-white.webp';

const emits = defineEmits(['toggle-menu'])

//       logo: null, // require("@/assets/logo.png"),
// const logo = ref(null)
// const menu = ref(false)
// const font_size = computed(() => xs.value ? 12 : 14)

const currentLogo = ref(animatedLogo);
const is_gif_playing = ref(true);

onMounted(() => {
  reloadLogo();
});

function reloadLogo() {
  is_gif_playing.value = true;
  currentLogo.value = animatedLogo;
  const gifDuration = 12000;
  const loops = 1;

  setTimeout(() => {
    currentLogo.value = staticLogo;
    is_gif_playing.value = false;
  }, gifDuration * loops);
}

const locales_with_image_flag = computed(() => {
  return locales.map((loc) => {
    return {
      ...loc,
      flag_image: `/flags_80/${loc.flag}.webp`,
      is_current: loc.code === currentLocale.value
    }
  })
})

const lang = computed(() => {
  if (query._storyblok_lang)
    return query._storyblok_lang
  return params.lang || 'es'
})

const full_locale = computed(() => {
  return locales_with_image_flag.value.find(
    loc => loc.code === currentLocale.value
  ) || locales_with_image_flag.value[0]
})

watch(currentLocale, (new_locale, old_locale) => {
  console.log('Current locale changed from', old_locale, 'to', new_locale)
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


function getImageUrl(name) {
  if (main_blok.value.logo && main_blok.value.logo.filename) {
    return main_blok.value.logo.filename
  }
  return new URL(`/assets/${name}`, import.meta.url).href
}


function changeLocale(new_locale) {
  console.log('Change locale to', new_locale)
  if (new_locale && new_locale !== full_locale.value.code) {
    // const prev_locale = current_locale.value.code
    const new_params = {...params, lang: new_locale}

    cookieLang.value = new_locale
    // router.push({ name, query, params: new_params })
    // window.location.reload()
    router.push({ name, query, params: new_params })
      .then(() => window.location.reload())

  }
}

</script>

<template>
  <v-app-bar
    app
    color="black"
    height="90"
    class="px-3 footer-shadow"
  >
    <div
      class="app-width2 d-flex px-3 justify-space-between align-center mx-auto"
      style="width: 100%;"
    >
      <div class="d-flex">

        <router-link
          :to="`/${lang}`"
          class="d-flex"
        >
          <v-img
            v-if="main_blok.logo && main_blok.logo.filename"
            :src="getImageUrl('p-white.svg')"
            :height="xs ? 60 : 60"
            :width="xs ? 60 : 60"
          />
          <v-img
            v-else
            :src="currentLogo"
            :height="is_gif_playing ? 60 : 50"
            :width="is_gif_playing ? 60 : 50"
            :class="is_gif_playing ? '' : 'py-1 ml-1'"
            @click="reloadLogo"
          />
        </router-link>
        <div v-if="false">
          <div>
            currentLocale: {{currentLocale}}
          </div>
          <div>
            full_locale: {{full_locale.code}}
          </div>
          <div>
            lang: {{lang}}
          </div>
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-chip
        color="white"
        variant="flat"
        class="font-weight-bold px-5"
      >
        <span class="text-uppercase">
          {{ full_locale.code }}
        </span>
        <v-avatar
          size="24"
          class="ml-2"
          rounded="sm"
        >
          <v-img
            :src="full_locale.flag_image"
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
              @click="changeLocale(locale.code)"
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
      <v-app-bar-nav-icon
        class="ml-4"
        @click="emits('toggle-menu')"
      ></v-app-bar-nav-icon>
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

.footer-shadow{
  box-shadow:
    0px 2px 3px -1px rgba(255, 255, 255, 0.4),
    0px 4px 4px 0px rgba(255, 255, 255, 0.3),
    0px 1px 2px 0px rgba(255, 255, 255, 0.2) !important;
}

</style>
