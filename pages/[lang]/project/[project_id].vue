<script setup>
const { $preview } = useNuxtApp()
// const { project_id } = useRoute().params
const { query, params } = useRoute()
const project_id = params.project_id
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `project/${project_id}`,
    {
      version: version,
      language: query._storyblok_lang || null,
      fallback_lang: null,
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