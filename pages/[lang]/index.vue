<script setup>
// import {onMounted} from "vue";

const { $preview } = useNuxtApp()
// import { currentLocale } from "~/composables/locales.js"
const { query, params } = useRoute()
const lang = computed(() => {
  if (query._storyblok_lang)
    return query._storyblok_lang
  return params.lang || 'es'
})
// const localeCookie = useCookie('user_lang')
// NUEVO
// console.log('currentLocale (index)', currentLocale.value)
// console.log('localeCookie (index)', localeCookie.value)
// console.log('query._storyblok_lang (index)', query._storyblok_lang)
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    'home',
    {
      version: version,
      // language: currentLocale.value,
      language: lang.value,
      // language: null,
      // fallback_lang: null,
    },
{ customParent: 'https://app.storyblok.com' }
)

// onMounted(() => {
//   console.log('query', query)
//   console.log('language', query._storyblok_lang)
// })


console.log('story', story)

// useSeoMeta({
//   title: 'Desplazamiento Interno en México',
//   ogTitle: 'Desplazamiento Interno en México',
//   description: 'Documentamos y divulgamos sobre eventos de desplazamiento interno en México.',
//   ogDescription: 'Documentamos y divulgamos sobre eventos de desplazamiento interno en México.',
//   // ogImage: 'https://oej.yeeko.org/_nuxt/nuevo_logo.ChaL5KSF.png',
// })


</script>

<template>
  <StoryblokComponent
    v-if="story" :blok="story.content"
  />
</template>
