<script setup>
const { query } = useRoute()
const storyblokApi = useStoryblokApi();

import {nextTick, onMounted} from "vue";
import {useWebStore} from "~/store/web.js";

const { $preview } = useNuxtApp()

const webStore = useWebStore()
const {
  setDocuments,
  setAllDocuments,
  setGlobalConfig,
  setAllProjects,
  setAllAgendas,
} = webStore

const version = $preview ? 'draft' : 'published'

let storyblok_lang = 'es'
if (query._storyblok_lang)
  storyblok_lang = String(query._storyblok_lang)

onMounted(() => {
  nextTick(() => {
    storyblokApi.getStories({
        version: version,
        starts_with: "project/",
        language: storyblok_lang,
      }
    ).then(({data}) => {
      // console.log("data all_projects", data);
      setAllProjects(data.stories);
    });
    storyblokApi.getStories({
        version: version,
        starts_with: "report/",
        language: storyblok_lang,
      }
    ).then(({data}) => {
      // console.log("data all_documents", data);
      setAllDocuments(data.stories);
    });
    storyblokApi.getStories({
        version: version,
        starts_with: "agend/",
        language: storyblok_lang,
      }
    ).then(({data}) => {
      // console.log("data all_agendas", data);
      setAllAgendas(data.stories);
    });
    storyblokApi.get(
      `cdn/stories`,
      {
        version: version,
        starts_with: "global",
        language: storyblok_lang,
      }
    ).then(({data}) => {
      // console.log("data global_config", data);
      if (data.stories.length)
        setGlobalConfig(data.stories[0].content);
    });
  });
});

</script>

<template>
  <v-app id="app-width">
    <NuxtPage />
  </v-app>
</template>

<style lang="scss">
@use '../assets/css/utils.scss' as *;
</style>