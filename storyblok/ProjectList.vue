<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')
import { resizeImg } from '~/composables/storyblok_images.js'
import {useWebStore} from "~/store/web.ts";
import {storeToRefs} from "pinia";
const webStore = useWebStore()
import { currentLocale } from "~/composables/locales.js"
// Store setup and state
const { all_projects } = storeToRefs(webStore)
import generic_poster from '~/assets/practica-poster.png'
import {flip} from "lodash/function.js";

const props = defineProps({
  blok: Object,
  projects: Array,
  full_projects: Array,
})

const final_projects = computed(() => {
  let full_projects = []
  if (props.full_projects){
    full_projects = props.full_projects
  }
  else{
    const projects_ids = props.projects || props.blok?.projects || []
    // console.log("projects_ids", projects_ids)
    // console.log("all_projects", all_projects.value)
    full_projects = projects_ids.map(
      id => all_projects.value.find(p => p.uuid === id)
    ).filter(p => p)
  }
  full_projects = full_projects.reduce((projects, project, idx) => {
    const is_first = idx === 0 && props.blok.display_type === 'home'
    let current_project = {...project, is_first}
    if (project.content.images.length > 0){
      const cover_image = project.content.images[0]
      current_project.cover_image = resizeImg(cover_image, 1200)
    } else {
      current_project.cover_image = generic_poster
    }
    projects.push(current_project)
    return projects
  },[])

  return full_projects
})

</script>

<template>
  <v-row
    justify="space-around"
    align="center"
    align-content="center"
    class="mx-3"
    v-editable="blok"
  >
    <v-col
      v-for="project in final_projects"
      :key="project._uid"
      v-editable="project"
      cols="12"
      :md="blok.display_type === 'home' && project.is_first ?  10 : 6"
      class="d-flex justify-center align-center full-height"
    >
      <v-card
        v-if="blok.display_type === 'home' || !blok.display_type"
        class="pb-4  d-flex flex-column"
        :height="project.is_first ? 300 : 220"
        style="width: 100%;"
      >
        <div
          class="back-poster poster-background"
          :style="`background-image: url(${project.cover_image})`"
        >

        </div>
        <div
          class="text-white pt-3 px-3 px-sm-5 pt-sm-5 font-weight-bold text-h4 text-md-h3"
        >
          {{project.content.name}}
        </div>
        <span class="text-white" v-if="false">
          cover: {{project.cover_image}}
        </span>
        <v-card-actions class="mt-auto">
          <v-spacer></v-spacer>
          <v-btn-primary
            bg-color="accentDark"
            class="text-white"
            variant="tonal"
            elevation="4"
            append-icon="arrow_right_alt"
            :to="`/${currentLocale}/${project.full_slug}`"
          >
            {{ blok.button_text }}
          </v-btn-primary>
        </v-card-actions>
      </v-card>
      <v-card
        v-else-if="blok.display_type === 'simple'"
        variant="text"
        class="pb-4 d-flex flex-column pointer"
        max-width="400"
        :href="project.content.website"
        target="_blank"
      >
        <v-img
          :src="resizeImg(project.content.logo, 800)"
          class="contain-image"
          height="180"
        ></v-img>
        <div class="pa-3 font-weight-bold text-h6 text-md-h5 text-center">
          {{project.name}}
        </div>
      </v-card>
      <v-card
        v-else-if="blok.display_type === 'detailed'"
        class="pb-4 poster-background d-flex flex-column"
        :height="parseInt(project.content.practica_id) === 1 ? 280 : 200"
      >
        <div class="pa-3 font-weight-bold text-h5 text-md-h4 project-title">
          {{project.name}}
        </div>

        <v-card-actions class="mt-auto">
          <v-spacer></v-spacer>
          <v-btn-primary
            bg-color="accentDark"
            class="text-accent"
            variant="tonal"
            elevation="4"
          >
            {{ blok.button_text }}
          </v-btn-primary>
        </v-card-actions>
      </v-card>
    </v-col>

  </v-row>

</template>

<style scoped lang="scss">
.title-no-wrap{
  white-space: normal !important;
}

.back-poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  //background: url('~/assets/practica-poster.png');
  background-size: cover;
  filter: brightness(0.6);
  //background-size: cover;
}

.poster-background {
  background: url('~/assets/practica-poster.png');
  background-size: cover;
  filter: brightness(0.6);
  //background-size: cover;
}

.project-titlex{
  text-shadow:
      1px 1px 3px #fff,
      -1px -1px 5px #fff,
      0 0 8px #ffffffaa;
}

.contain-image{
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}

</style>
