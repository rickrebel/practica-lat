<script setup lang="ts">
const { $preview } = useNuxtApp()
// const { project_id } = useRoute().params
const { query, params } = useRoute()
const slug = params.slug
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
let storyblok_lang: string = 'es'
if (query._storyblok_lang)
  storyblok_lang = String(query._storyblok_lang)
const story = await useAsyncStoryblok(
    `${slug}`,
    {
      version: version,
      language: storyblok_lang,
      fallback_lang: 'es',
    },
{ customParent: 'https://app.storyblok.com' }
)
</script>

<template>
  <StoryblokComponent
    v-if="story"
    :blok="story.content"
  />
</template>

<style scoped lang="scss">

</style>