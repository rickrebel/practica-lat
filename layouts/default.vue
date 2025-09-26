<script setup>
// import 'vuetify/src/styles/settings/_variables';
// import colors from 'vuetify/lib/util/colors';
import MainNav from "~/components/web/MainNav.vue";
import Footer from "~/components/web/Footer.vue";


import {nextTick, onMounted} from "vue";
import {useWebStore} from '~/store/web.ts'
const storyblokApi = useStoryblokApi();
import { useTheme } from 'vuetify';

const { $preview } = useNuxtApp()

const webStore = useWebStore()
const { setDocuments, setAllDocuments, setGlobalConfig, setAllProjects } = webStore

const version = $preview ? 'draft' : 'published'

onMounted(() => {
  nextTick(() => {
    // storyblokApi.get(
    //   `cdn/stories/documents`,
    //   {
    //     version: version,
    //   }
    // ).then(({data}) => {
    //   // console.log("data", data);
    //   setDocuments(data.story.content);
    //   // documents.value = data.story.content;
    // });
    // storyblokApi.getAll(
    storyblokApi.getStories({
        version: version,
        starts_with: "project/"
      }
    ).then(({data}) => {
      // console.log("data all_projects", data);
      setAllProjects(data.stories);
      // documents.value = data.story.content;
    });
    storyblokApi.getStories({
        version: version,
        starts_with: "report/"
      }
    ).then(({data}) => {
      // console.log("data all_documents", data);
      setAllDocuments(data.stories);
      // documents.value = data.story.content;
    });
    storyblokApi.get(
      `cdn/stories`,
      {
        version: version,
        starts_with: "global"
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
  <v-app>
    <v-layout>
      <v-container class="_px-1 _px-sm-3 px-0 pt-0" fluid>
      <v-responsive
        max-width="1440"
        class="mx-auto _dfi-app-width"
      >
        <MainNav/>
        <v-main class="" id="app-width">
            <NuxtPage />
        </v-main>
      </v-responsive>

      </v-container>
    </v-layout>
    <Footer />
    <svg width="0" height="0" style="position:absolute;">
      <defs>
        <filter id="sandpaper-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </defs>
    </svg>
  </v-app>
</template>

<style lang="scss">
@use 'sass:map';
@use '../assets/css/utils.scss' as *;
@use 'vuetify/settings' as *;

.dfi-app-width {
  //max-width: 1440px;
  //margin-left: auto;
  //margin-right: auto;
}

//@media #{map.get($display-breakpoints, 'sm-and-down')} {
//    .custom-class {
//        display: block;
//    }
//}
</style>
