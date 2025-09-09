<script setup>
const { $preview } = useNuxtApp()
const { report_id } = useRoute().params
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `report/${report_id}`,
    { version: version },
{ customParent: 'https://app.storyblok.com' }
)
// useHead({
//   title: 'My App',
//   meta: [
//     {
//       name: 'description',
//       content: 'My amazing site.'
//     },
//     {
//       property: 'og:title',
//       content: 'My App'
//     },
//     {
//       property: 'title',
//       content: 'My App 2'
//     },
//     {
//       property: 'titleTemplate',
//       content: 'My App 3'
//     },
//     {
//       property: 'og:description',
//       content: 'My amazing site.'
//     }
//   ],
//   // bodyAttrs: {
//   //   class: 'test'
//   // },
//   // script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
// })
useSeoMeta({
  title: `${story.value.content?.document[0].name} - Desplazamiento Interno en México`,
  ogTitle: `${story.value.content?.document[0].name} (Desplazamiento Interno en México)`,
  description: 'Documentamos y divulgamos sobre eventos de desplazamiento interno en México.',
  type: 'article',
  ogDescription: 'Documentamos y divulgamos sobre eventos de desplazamiento interno en México.',
  // ogImage: 'https://oej.yeeko.org/_nuxt/nuevo_logo.ChaL5KSF.png',
})

</script>

<template>
  <StoryblokComponent
    v-if="story" :blok="story.content"
  />
</template>

<style scoped lang="scss">

</style>