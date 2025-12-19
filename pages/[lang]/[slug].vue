<script setup>
const { $preview } = useNuxtApp()
// const { project_id } = useRoute().params
const { params } = useRoute()
const lang = useStoryblokLang()

const slug = params.slug
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `${lang.prefix}${slug}`,
    {
      version: version,
      language: lang.final_code,
      // fallback_lang: 'es',
    },
{ customParent: 'https://app.storyblok.com' }
)

onMounted(() => {
  // console.log('Onmounted [lang][slug].vue - slug:', slug)
})


</script>

<template>
  <StoryblokComponent
    v-if="story"
    :blok="story.content"
  />
</template>

<style scoped lang="scss">

</style>