<script setup>
import {onMounted} from "vue";

const { $preview } = useNuxtApp()
// import { apiPlugin, storyblokInit, useStoryblokBridge } from '@storyblok/vue';
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
const lang = useStoryblokLang()
// const storyblokApi = useStoryblokApi();
// console.log("language query (index)", query._storyblok_lang)
const story = await useAsyncStoryblok(
    `${lang.prefix}home`,
    {
      version: version,
      language: lang.final_code,
      fallback_lang: null,
    },
{ customParent: 'https://app.storyblok.com' }
)

onMounted(() => {
  console.log('onMounted home page')
  // console.log('language', query._storyblok_lang)
})


// console.log('story', story)

useSeoMeta({
  title: 'Desplazamiento Interno en México',
  ogTitle: 'Desplazamiento Interno en México',
  description: 'Documentamos y divulgamos sobre eventos de desplazamiento interno en México.',
  ogDescription: 'Documentamos y divulgamos sobre eventos de desplazamiento interno en México.',
  // ogImage: 'https://oej.yeeko.org/_nuxt/nuevo_logo.ChaL5KSF.png',
})


</script>

<template>
  <StoryblokComponent
    v-if="story" :blok="story.content"
  />
</template>
