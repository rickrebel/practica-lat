<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')
import {resizeImg, transformImage} from '~/composables/storyblok_images.js'
// import {useWebStore} from "~/store/web.ts";
// import {storeToRefs} from "pinia";
// const webStore = useWebStore()
// const { all_projects } = storeToRefs(webStore)
// import { currentLocale } from "~/composables/locales.js"
const lang = useStoryblokLang()
// Store setup and state
import generic_poster from '~/assets/practica-poster.png'
import {computed} from "vue";
import ProjectButtons from "~/components/web/ProjectButtons.vue";

const props = defineProps({
  blok: Object,
  projects: Array,
  full_projects: Array,
  display_type: {
    type: String,
    required: false,
  },
})

const final_display_type = computed(() => {
  if (props.display_type)
    return props.display_type
  if (props.blok && props.blok.display_type)
    return props.blok.display_type
  return 'home'
})

const is_home = computed(() => final_display_type.value === 'home')

function hydrateText(text) {
  let rich_text = renderRichText(text)
  if (!rich_text)
    return '-'
  rich_text = rich_text.replace(
    /<p>/g, '<p class="mt-2 mt-sm-4">')
  return rich_text
}

const final_projects = computed(() => {
  let full_projects = []
  if (props.full_projects){
    full_projects = props.full_projects
  }
  else{
    if (props.blok.projects.length === 0)
      return []
    const first_project = props.blok.projects[0]
    if (typeof first_project === 'string') {

      // const projects_ids = props.projects || props.blok?.projects || []
      // full_projects = projects_ids.map(
      //   id => all_projects.value.find(p => p.uuid === id)
      // ).filter(p => p)
    }
    else
      full_projects = props.blok.projects
  }
  // console.log("full_projects", full_projects)
  full_projects = full_projects.reduce((projects, project, idx) => {
    const is_home = final_display_type.value === 'home'
    const is_first = idx === 0 && is_home

    const max_width = is_home ? (is_first ? 900 : 600) : 600
    let current_project = {...project, is_first, max_width}
    if (!is_home){
      project.explanation = hydrateText(project.content.description)
    }
    if (project.content.images.length > 0){
      const cover_image = project.content.images[0]
      current_project.cover_image = resizeImg(cover_image, max_width)
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
    <v-col cols="12" v-if="false">
      Hola projects
      <v-code v-if="false">
        {{blok.projects}}
      </v-code>
    </v-col>
    <v-col
      v-for="project in final_projects"
      :key="project._uid"
      v-editable="project"
      cols="12"
      :sm="is_home ? (project.is_first ? 8 : 6) : 10"
      :md="is_home ? (project.is_first ? 8 : 6) : 10"
      class="d-flex justify-center xalign-center full-height"
    >
      <v-card
        v-if="final_display_type === 'home' || !final_display_type"
        class="pb-4  d-flex flex-column"
        :height="project.is_first ? 300 : 220"
        :max-width="project.max_width"
        style="width: 100%;"
        :to="`/${lang.code}/project/${project.slug}`"
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
        <v-card-actions class="mt-auto">
          <v-spacer></v-spacer>
          <v-btn-primary
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
        v-else-if="final_display_type === 'simple'"
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
          {{project.name}} ??
        </div>
      </v-card>
      <v-card
        v-else-if="final_display_type === 'detailed'"
        class="d-flex"
        xheight="240"
        color="black"
        style="width: 100%; max-width: 1040px;"
      >
        <v-row>
          <v-col
            cols="12"
            md="4"
            lg="5"
            class="d-flex align-center full-height"
          >
            <v-img
              :src="project.cover_image"
              class="grey lighten-2"
              aspect-ratio="1"
              cover
              max-height="260"
            ></v-img>
          </v-col>
          <v-col
            cols="12"
            md="8"
            lg="7"

          >
            <v-card
              variant="flat"
              color="transparent"
              tile
              style="text-wrap: pretty; overflow: hidden; width: 100%;"
              class="full-height d-flex flex-column px-3"
            >

              <v-card-title
                class="pa-3 font-weight-bold text-h6 text-md-h5 title-no-wrap"
              >
                {{project.name}}
              </v-card-title>
              <v-card-text
                class="text-sm-subtitle-1 special-img text-white"
              >
                <div
                  v-html="project.explanation"
                  class="text-sm-body-2 text-justify text-body-2"

                ></div>
              </v-card-text>
              <v-spacer></v-spacer>
              <ProjectButtons
                :project_content="project.content"
              >
                <template v-slot:complementary_buttons>
                  <v-btn-primary
                    bg-color="accentDark"
                    class="text-accent"
                    variant="tonal"
                    elevation="4"
                  >
                    {{ blok.button_text }}
                  </v-btn-primary>
                </template>

              </ProjectButtons>

<!--              <v-card-actions>-->
<!--                <v-spacer></v-spacer>-->
<!--              </v-card-actions>-->
            </v-card>
          </v-col>
        </v-row>
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
  background-position-y: center;
  background-position-x: center;
  //background-size: cover;
}

.poster-background {
  //background: url('~/assets/practica-poster.png');
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

.title-no-wrap{
  white-space: normal !important;
}

</style>
