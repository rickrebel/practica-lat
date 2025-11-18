<script setup>
const { $preview } = useNuxtApp()
// const { page_name } = useRoute().params

const version = $preview ? 'draft' : 'published'
// console.log('version', version)
const story = await useAsyncStoryblok(
    'test-rick',
    {
      version: version,
      language: 'es',
      resolve_relations: ['ProjectList.projects'],
      fallback_lang: null,
    },
{
  customParent: 'https://app.storyblok.com',
  cache: 'no-cache',
}
)

// console.log('story', story)

// useSeoMeta({
//
// })


</script>

<template>
  <StoryblokComponent
    v-if="story" :blok="story.content"
  />
</template>
