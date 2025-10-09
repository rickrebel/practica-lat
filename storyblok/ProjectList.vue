<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')
import { resizeImg } from '~/composables/storyblok_images.js'
import {useWebStore} from "~/store/web.ts";
import {storeToRefs} from "pinia";
const webStore = useWebStore()
// Store setup and state
const { all_projects } = storeToRefs(webStore)

const props = defineProps({
  blok: Object,
  projects: Array,
  full_projects: Array,
})

const final_projects = computed(() => {
  if (props.full_projects)
    return props.full_projects
  const projects_ids = props.projects || props.blok?.projects || []
  // console.log("projects_ids", projects_ids)
  // console.log("all_projects", all_projects.value)
  let selected_projects = all_projects.value.filter(
    p => projects_ids.includes(p.uuid))
  // sort by practica_id ascending
  // console.log("selected_projects", selected_projects)
  selected_projects.sort((a, b) =>
    parseInt(a.content.practica_id || 99)
      - parseInt(b.content.practica_id || 99)
  )
  return selected_projects
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
      :sm="(blok.display_type === 'home'
        && parseInt(project.content.practica_id) === 1) ?  10 : 6"
      class="align-center justify-space-between full-height"
    >
      <v-card
        v-if="blok.display_type === 'home' || !blok.display_type"
        class="pb-4 paper-texture d-flex flex-column"
        :height="parseInt(project.content.practica_id) === 1 ? 280 : 200"
      >
        <div class="text-white pa-3 pa-sm-5 font-weight-bold text-h4 text-md-h3">
          {{project.content.name}}
        </div>
        <v-card-actions class="mt-auto">
          <v-spacer></v-spacer>
          <v-btn-primary
            bg-color="accentDark"
            class="text-white"
            variant="tonal"
            elevation="4"
            append-icon="arrow_right_alt"
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
        class="pb-4 paper-texture d-flex flex-column"
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

.paper-texture {
  _position: absolute;
  _width: 473px;
  _height: 843px;
  _left: 0px;
  _top: 227px;
  z-index: 4;
  background: url('~/assets/generic-poster.png');
  background-size: cover;

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
