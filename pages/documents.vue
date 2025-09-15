<script setup>
const { $preview } = useNuxtApp()
const version = $preview ? 'draft' : 'published'
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const story = await useStoryblok('documents',
  { version: version }
)

</script>

<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>
