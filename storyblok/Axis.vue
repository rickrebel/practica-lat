<script setup>
import { resizeImg } from '~/composables/storyblok_images.js'
import dayjs from "dayjs";
const props = defineProps({
  blok: Object,
  story: Object,
  is_editable: {
    type: Boolean,
    default: true
  },
  is_list: Boolean,
})
import { useDisplay } from 'vuetify'
import CommonTitle from "~/components/web/CommonTitle.vue";
import {useWebStore} from "~/store/web.ts";
import {storeToRefs} from "pinia";
const { xs, mdAndUp } = useDisplay()
const webStore = useWebStore()
// const { all_documents } = webStore
const { all_projects } = storeToRefs(webStore)


const explanation = computed(() => {
  let rich_text = renderRichText(props.blok.description)
  if (!rich_text)
    return '-'
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse">')
  return rich_text
})


const related_projects = computed(() => {
  console.log('all_projects', all_projects.value)
  // console.log('current_blok', props.blok)
  // console.log('current_story', props.story)
  // return all_documents.value
  // return []
  return all_projects.value.filter(
      project => project.content.axis === props.story.uuid)
})

const artificial_blok = {
  subheader: 'Proyectos del eje',
  color_title: 'black',
  init_display: 4,
}

const artificial_blok_list = {
  button_text: 'Ver más',
}

const class_effect = computed(() => {
  let final_class = ''
  const num = parseInt(props.blok._uid.replace(/\D/g, '').slice(-1)) // get last digit
  console.log("num", num)
  if (num % 4 === 0)
    final_class += ' effect-1'
  else if (num % 4 === 1)
    final_class += ' effect-2'
  else if (num % 4 === 2)
    final_class += ' effect-3'
  return final_class
})

const justify = ref(props.blok.justify || false)

</script>

<template>
  <v-card
    v-if="blok"
    :color="blok.color || 'transparent'"
    v-editable="is_editable ? blok : null"
    variant="flat"
    class="paper-texture pt-6 pb-12"
    :class="class_effect"
    tile
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
        align-self="center"
        class="pa-3 pa-md-6"
      >
        <v-sheet
          v-if="blok.logo?.filename"
          class="d-flex justify-space-between align-center"
          max-height="200"
          color="transparent"
        >
          <v-img
            :aspect-ratio="1"
            :src="resizeImg(blok.logo, 400)"
            max-height="200"
            max-width="480"
            contain
            class="contain"
          ></v-img>
        </v-sheet>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="pt-6 "
      >
<!--        <v-card-subtitle-->
<!--          v-if="blok.pre_title"-->
<!--          class="text-h6 montse mx-3 font-weight-medium"-->
<!--          style="opacity: 100%"-->
<!--        >-->
<!--          {{ blok.pre_title }}-->
<!--        </v-card-subtitle>-->
        <v-card-title
          class="text-h4 title-no-wrap pt-0 font-weight-bold montse mx-3"
        >
          {{ blok.name }}
        </v-card-title>
        <v-card-text
          v-html="explanation"
          class="text-sm-subtitle-1 special-img mx-3 text-black"
          :class="{'text-justify' : justify}"
        ></v-card-text>
        <v-divider class="my-2" >
        </v-divider>
      </v-col>

    </v-row>
    <v-card
      class="pb-2 pb-md-4 mt-3 pt-3"
      elevation="0"
      variant="flat"
      color="transparent"
      tile
    >
      <CommonTitle
        :blok="artificial_blok"
        class="mb-6 mt-3"
      />
      <div class="content">
        <ProjectList
          :full_projects="related_projects"
          :blok="artificial_blok_list"
          display_type="detailed"
        />
      </div>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">

.title-no-wrap{
  white-space: normal !important;
}

.outlined-card {
  border: 1px solid #bbbbbb !important;
}


</style>