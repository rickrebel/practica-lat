<script setup lang="ts">
const { $preview } = useNuxtApp()
// const { project_id } = useRoute().params
const { query, params } = useRoute()
const lang = computed(() => {
  if (query._storyblok_lang)
    return query._storyblok_lang
  return params.lang || 'es'
})
import { currentLocale } from "~/composables/locales.js"
const slug = params.slug
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `${slug}`,
    {
      version: version,
      language: lang.value,
      // fallback_lang: 'es',
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