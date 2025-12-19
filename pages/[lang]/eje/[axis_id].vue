<script setup>
const { $preview } = useNuxtApp()
// const { axis_id } = useRoute().params
// import { currentLocale } from "~/composables/locales.js"
const { params } = useRoute()
const lang = useStoryblokLang()
const axis_id = params.axis_id
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `${lang.prefix}eje/${axis_id}`,
    {
      version: version,
      language: lang.final_code,
      // fallback_lang: null,
    },
{ customParent: 'https://app.storyblok.com' }
)
</script>

<template>
  <Axis
    v-if="story"
    :blok="story.content"
    :story="story"

  />
</template>

<style scoped lang="scss">

</style>