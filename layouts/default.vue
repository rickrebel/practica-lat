<script setup>
// import 'vuetify/src/styles/settings/_variables';
// import colors from 'vuetify/lib/util/colors';
import MainNav from "~/components/web/MainNav.vue";
import MainMenu from "~/components/web/MainMenu.vue";
import Footer from "~/components/web/Footer.vue";

import {nextTick, onMounted} from "vue";
const storyblokApi = useStoryblokApi();
import {useWebStore} from '~/store/web.ts'
import { currentLocale } from "~/composables/locales.js"
import { useTheme } from 'vuetify';
const { $preview } = useNuxtApp()
// const { query } = useRoute()
// const localeCookie = useCookie('user_lang')


const webStore = useWebStore()
const {
  setDocuments,
  setAllDocuments,
  setGlobalConfig,
  setAllProjects,
  setAllAgendas,
} = webStore

const version = $preview ? 'draft' : 'published'

const menu_drawer = ref(false);

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
        starts_with: "agend/",
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

function changeMenu() {
  menu_drawer.value = !menu_drawer.value;
}


</script>

<template>
  <v-app>
    <MainNav @toggleMenu="changeMenu"/>
    <MainMenu :menu_drawer="menu_drawer"/>
    <v-main>
      <v-container
        class="_px-1 _px-sm-3 px-0 pt-0"
        fluid
        max-width="1440"
      >
        <NuxtPage />
      </v-container>
    </v-main>
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
