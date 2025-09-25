<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')
import { resizeImg } from '~/composables/storyblok_images.js'
import {useWebStore} from "~/store/web.js";
import {storeToRefs} from "pinia";
const webStore = useWebStore()
// Store setup and state
const { all_projects } = storeToRefs(webStore)

const props = defineProps({
  blok: Object,
  projects: Array
})

const final_projects = computed(() => {
  const projects_ids = props.projects || props.blok?.projects || []
  // console.log("projects_ids", projects_ids)
  // console.log("all_projects", all_projects.value)
  return all_projects.value.filter(p => projects_ids.includes(p.uuid))
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
      :sm="parseInt(project.content.practica_id) === 1 ?  10 : 6"
      class="align-center justify-space-between full-height"
    >
      <v-card
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
            class="text-black"
            variant="tonal"
          >
            {{ blok.button_text }}
          </v-btn-primary>
        </v-card-actions>
<!--        <a :href="project.url?.url || ''" target="_blank">-->
<!--          <v-img-->
<!--            :src="resizeImg(note.cover, 350)"-->
<!--            :alt="`Institución ${note}`"-->
<!--            :max-height="blok.max_height || 160"-->
<!--            :max-width="blok.max_width || 350"-->
<!--            cover-->
<!--          ></v-img>-->
<!--        </a>-->
<!--        <v-card-subtitle-->
<!--          class="text-body-2 d-flex justify-space-between pt-3"-->
<!--        >-->
<!--          {{project.source}}-->
<!--          <v-spacer></v-spacer>-->
<!--          {{dayjs(project.date).format('DD/MMMM/YYYY')}}-->
<!--        </v-card-subtitle>-->
<!--        <a :href="project.url?.url || ''" target="_blank">-->
<!--          <v-card-title-->
<!--            class="text-info title-no-wrap text-subtitle-1 font-weight-bold lato"-->
<!--            style="white-space: normal !important;"-->
<!--          >-->
<!--            {{project.title}}-->
<!--          </v-card-title>-->
<!--        </a>-->
<!--        <v-tooltip-->
<!--          v-if="project.subtitle"-->
<!--          activator="parent"-->
<!--          location="bottom"-->

<!--        >-->
<!--          <v-card max-width="300" color="transparent">-->


<!--          {{ project.subtitle }}-->
<!--          </v-card>-->
<!--        </v-tooltip>-->

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

.project-title{
  text-shadow:
      1px 1px 3px #fff,
      -1px -1px 5px #fff,
      0 0 8px #ffffffaa;
}

</style>
