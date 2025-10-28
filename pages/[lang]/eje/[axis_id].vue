<script setup>
const { $preview } = useNuxtApp()
// const { axis_id } = useRoute().params
// import { currentLocale } from "~/composables/locales.js"
const { query, params } = useRoute()
const lang = computed(() => {
  if (query._storyblok_lang)
    return query._storyblok_lang
  return params.lang || 'es'
})
const axis_id = params.axis_id
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `agenda/${axis_id}`,
    {
      version: version,
      language: lang.value,
      // fallback_lang: null,
    },
{ customParent: 'https://app.storyblok.com' }
)
</script>

<template>
  <Agend
    v-if="story"
    :blok="story.content"
    :story="story"

  />
</template>

<style scoped lang="scss">

</style>