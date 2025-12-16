<script setup>
// import {onMounted} from "vue";

const { $preview } = useNuxtApp()
// import { currentLocale } from "~/composables/locales.js"
const lang = useStoryblokLang()
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `${lang.prefix}home`,
    {
      version: version,
      language: lang.final_code,
      resolve_relations: ['ProjectList.projects'],
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


</script>

<template>
  <StoryblokComponent
    v-if="story" :blok="story.content"
  />
</template>
