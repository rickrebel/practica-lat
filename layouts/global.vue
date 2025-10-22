<script setup>
const storyblokApi = useStoryblokApi();

import {nextTick, onMounted} from "vue";
import {useWebStore} from "~/store/web.js";
import { currentLocale } from "~/composables/locales.js"
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

onMounted(() => {
  nextTick(() => {
    storyblokApi.getStories({
        version: version,
        starts_with: "project/",
        language: currentLocale.value,
      }
    ).then(({data}) => {
      // console.log("data all_projects", data);
      setAllProjects(data.stories);
    });
    storyblokApi.getStories({
        version: version,
        starts_with: "report/",
        language: currentLocale.value,
      }
    ).then(({data}) => {
      // console.log("data all_documents", data);
      setAllDocuments(data.stories);
    });
    storyblokApi.getStories({
        version: version,
        starts_with: "agenda/",
        language: currentLocale.value,
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
        language: currentLocale.value,
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