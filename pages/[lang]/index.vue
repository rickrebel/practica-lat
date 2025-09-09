<script setup>
import {onMounted} from "vue";

const { $preview } = useNuxtApp()
const { query } = useRoute()
// import { apiPlugin, storyblokInit, useStoryblokBridge } from '@storyblok/vue';
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
// const storyblokApi = useStoryblokApi();
// console.log("language query (lang)", query._storyblok_lang)
const story = await useAsyncStoryblok(
    'home',
    {
      version: version,
      // language: 'en',
      // language: null,
      language: query._storyblok_lang || null,
      fallback_lang: null,
    },
{ customParent: 'https://app.storyblok.com' }
)

// onMounted(() => {
//   console.log('query', query)
//   console.log('language', query._storyblok_lang)
// })


// console.log('story', story)

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
