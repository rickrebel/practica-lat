<script setup>
import { resizeImg } from '~/composables/storyblok_images.js'
import dayjs from "dayjs";
const props = defineProps({
  blok: Object,
})
import { useDisplay } from 'vuetify'
import CommonTitle from "~/components/web/CommonTitle.vue";
import {useWebStore} from "~/store/web.ts";
import {storeToRefs} from "pinia";
const { xs, mdAndUp } = useDisplay()
const webStore = useWebStore()
// const { all_documents } = webStore
const { all_documents } = storeToRefs(webStore)


const explanation = computed(() => {
  let rich_text = renderRichText(props.blok.description)
  if (!rich_text)
    return '-'
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse text-white">')
  return rich_text
})


const related_documents = computed(() => {
  // console.log('documents', all_documents.value)
  // return all_documents.value
  // return []
  return all_documents.value.filter((doc, idx) => idx < 4)
})

const artificial_blok = {
  subheader: 'Informes y Reportes',
  color_title: 'black',
  init_display: 4,
}

const justify = ref(props.blok.justify || false)

</script>

<template>
  <v-card
    v-if="blok"
    color="black"
    v-editable="blok"
    variant="flat"
    class="outlined-card"
    tile
  >
    <div class="d-flex _flex-no-wrap flex-column">
      <v-sheet
        v-if="blok.logo?.filename"
        class="d-flex justify-center align-center"
        max-height="200"
        color="transparent"
        style="width: 100%;"
      >
        <v-img
          :aspect-ratio="1"
          :src="resizeImg(blok.logo, 400)"
          max-height="200"
          max-width="480"
          contain
          class="contain"
        ></v-img>
        <v-chip
          v-if="blok.project_type === 'assistance'"
          color="secondary"
          class="font-weight-bold px-5 mx-3"
        >
          Asistencia técnica especializada
        </v-chip>
      </v-sheet>
      <div class="pt-6">
        <v-card-title
          class="text-h4 title-no-wrap pt-0 font-weight-bold mx-3 text-center"
        >
          {{ blok.name }}
        </v-card-title>
        <v-card-text
          v-html="explanation"
          class="text-sm-subtitle-1 special-img mx-3"
          :class="{'text-justify' : justify}"
        ></v-card-text>
        <v-divider class="my-2" >
        </v-divider>
      </div>
      <v-card-actions class="pt-4 px-8">
        <v-btn-primary
          variant="flat"
          color="accent"
          :append-icon="false"
          :href="blok.website"
          target="_blank"
          class="font-weight-medium mr-4"
        >
          {{blok.website}}
        </v-btn-primary>
        <v-btn
          v-for="net in blok.social_networks"
          :key="net._uid"
          align="end"
          class="mr-4 text-primary"
          icon
          variant="text"
          @click="wantOpenLink(net.url)"
          color="white"
        >
          <v-avatar
            v-if="net.logo"
            size="default"
          >
            <img
              :src="resizeImg(net.logo, 80)"
              :alt="net.icon"
              :height="24"
            >
          </v-avatar>
          <v-icon v-else size="large" color="white">
            user
          </v-icon>
        </v-btn>

      </v-card-actions>
      <v-card
        class="mt-8 pt-8 pb-14"
        variant="flat"
        color="grey-darken-4"
      >
        <Paragraph
          v-for="blok in blok.content"
          :key="blok._uid"
          :blok="blok"
        ></Paragraph>
      </v-card>
    </div>
    <v-card
      class="pb-2 pb-md-4 mt-3 pt-3"
      elevation="0"
      variant="flat"
      color="white"
    >

      <CommonTitle
        :blok="artificial_blok"
      />
      <DocumentList
        :init_documents="related_documents"
      />
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