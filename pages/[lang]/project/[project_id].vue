<script setup>
const { $preview } = useNuxtApp()
// const { project_id } = useRoute().params
// import { currentLocale } from "~/composables/locales.js"
const { query, params } = useRoute()
const lang = useStoryblokLang()
const project_id = params.project_id
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
  `${lang.prefix}project/${project_id}`,
  {
    version: version,
    // language: currentLocale.value,
    language: lang.final_code,
    // fallback_lang: null,
  },
{ customParent: 'https://app.storyblok.com' }
)
</script>

<template>
  <StoryblokComponent
    v-if="story"
    :blok="story.content"
    :uid="story.uuid"
  />
</template>

<style scoped lang="scss">

</style>