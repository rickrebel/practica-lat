<script setup>
const { $preview } = useNuxtApp()
const lang = useRoute().params.lang
const params = useRoute().params
const version = $preview ? 'draft' : 'published'

const availableLanguages = ['es', 'en', 'pt', 'fr'];
let language = availableLanguages.includes(lang) ? lang : undefined;
if (!language || language === 'es') {
  language = 'default'
}

console.log('lang', lang)
console.log('language', language)
console.log('params', params)

const story = await useAsyncStoryblok(
  'home',
  {
    version,
    // resolve_relations: 'featured-articles.articles',
    language,
    fallback_lang: null,
  },
  {
    customParent: 'https://app.storyblok.com',
    cache: 'no-cache',
  }
);

</script>

<template>
  <StoryblokComponent
    v-if="story"
    :blok="story.content"
  />
</template>