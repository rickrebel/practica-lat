<script setup>
const { $preview } = useNuxtApp()
// const { agend_id } = useRoute().params
const { query, params } = useRoute()
const agend_id = params.agend_id
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `agend/${agend_id}`,
    {
      version: version,
      language: query._storyblok_lang || null,
      fallback_lang: null,
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