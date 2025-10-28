<script setup>
// import {onMounted} from "vue";

import {currentLocale} from "~/composables/locales.js";

const { $preview } = useNuxtApp()
// import { currentLocale } from "~/composables/locales.js"
const lang = useStoryblokLang()
// const localeCookie = useCookie('user_lang')
// NUEVO
// console.log('currentLocale (index)', currentLocale.value)
// console.log('localeCookie (index)', localeCookie.value)
// console.log('query._storyblok_lang (index)', query._storyblok_lang)
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `${lang.prefix}home`,
    {
      version: version,
      // language: currentLocale.value,
      language: lang.final_code,
      // language: null,
      // fallback_lang: null,
    },
{ customParent: 'https://app.storyblok.com' }
)

// useSeoMeta({
//   title: 'Desplazamiento Interno en México',
//   ogTitle: 'Desplazamiento Interno en México',
//   description: 'Documentamos y divulgamos sobre eventos de desplazamiento interno en México.',
//   ogDescription: 'Documentamos y divulgamos sobre eventos de desplazamiento interno en México.',
//   // ogImage: 'https://oej.yeeko.org/_nuxt/nuevo_logo.ChaL5KSF.png',
// })

onMounted(() => {
  console.log('Onmounted [lang]index.vue')
  console.log('story:', story)
})


</script>

<template>
  <StoryblokComponent
    v-if="story" :blok="story.content"
  />
</template>
