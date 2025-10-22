<script setup>
import CommonTitle from "~/components/web/CommonTitle.vue";

import { resizeImg } from '~/composables/storyblok_images.js'
import {storeToRefs} from "pinia";
import {useWebStore} from "~/store/web.ts";
const webStore = useWebStore()
const { all_documents } = storeToRefs(webStore)

const props = defineProps({
  blok: Object,
  uid: {
    type: String,
    required: true,
  }
})

const explanation = computed(() => {
  let rich_text = renderRichText(props.blok.description)
  if (!rich_text)
    return null
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse text-white">')
  return rich_text
})


const related_documents = computed(() => {
  console.log('documents', all_documents.value)
  console.log('blok', props.blok)
  console.log('uid', props.uid)
  // return all_documents.value
  // return []
  return all_documents.value.filter((doc, idx) =>
    idx < 4 && doc.projects2 === props.uid
  )
})

const artificial_blok = {
  subheader: 'Informes y Reportes',
  color_title: 'black',
  init_display: 4,
}

const justify = ref(props.blok.justify || false)

const social_dict = {
  facebook: 'social/facebook_blanco.png',
  twitter: 'social/twitter_blanco.png',
  instagram: 'social/instagram_blanco.png',
  threads: 'social/threads_blanco.png',
}

const social_networks = computed(() => {
  if (!props.blok.social_networks)
    return []
  return props.blok.social_networks.map(net => {
    if (!net.logo?.filename && net.social_network) {
      const icon = social_dict[net.social_network.toLowerCase()]
      if (icon)
        // net.simple_logo = `@/assets/${icon}`
        net.simple_logo = `/${icon}`
    }
    return net
  })
})


function getImageUrl(name) {
  return new URL(`@/assets/social/${name}`, import.meta.url).href
}

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
      <div class="pt-6 pt-sm-12">
        <v-card-title
          v-if="!blok.hide_name"
          class="text-h4 title-no-wrap pt-0 font-weight-bold mx-3 text-center"
        >
          {{ blok.name }}
        </v-card-title>
        <v-card-text
          v-if="explanation"
          v-html="explanation"
          class="text-sm-subtitle-1 special-img mx-3 pt-1"
          :class="{'text-justify' : justify}"
        ></v-card-text>
        <v-divider class="my-2" >
        </v-divider>
      </div>
      <v-card-actions
        v-if="blok.website || (social_networks && social_networks.length > 0)"
        class="px-8 mb-2 mb-sm-6"
      >
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
          v-for="net in social_networks"
          :key="net._uid"
          align="end"
          class="mr-4 text-primary"
          icon
          variant="text"
          :href="net.url"
          target="_blank"
          color="white"
        >
          <v-avatar
            v-if="net.simple_logo"
            size="default"
          >
            <img
              :src="net.simple_logo"
              :alt="net.icon"
              :height="24"
            >
          </v-avatar>
          <v-avatar
            v-else-if="net.logo?.filename"
            size="default"
          >
            <img
              :src="resizeImg(net.logo, 80)"
              :alt="net.logo"
              :height="24"
            >
          </v-avatar>
          <v-icon v-else size="large" color="white">
            user
          </v-icon>

          <v-tooltip
            location="top"
            activator="parent"
            :text="net.social_network || 'Red social'"
          ></v-tooltip>
        </v-btn>

      </v-card-actions>
      <Carrousel
        :images="blok.images || []"
      />
      <v-card
        class="mt-8 pt-8 pt-sm-12 pb-14"
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
      v-if="related_documents && related_documents.length > 0"
      class="pb-2 pb-md-4 pt-6 pt-sm-10"
      elevation="0"
      variant="flat"
      color="white"
    >

      <CommonTitle
        :blok="artificial_blok"
        class="pb-6"
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