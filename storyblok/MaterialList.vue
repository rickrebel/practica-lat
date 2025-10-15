<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {useWebStore} from '~/store/web.ts'
import { resizeImg } from '~/composables/storyblok_images.js'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import * as d3 from 'd3'

dayjs.locale('es')

const webStore = useWebStore()
const { materials } = storeToRefs(webStore)

const props = defineProps({
  blok: Object
})

const currIdx = ref(undefined)
const expandedIdxs = ref([])
const selectedMats = ref([])
const typeMaterials = ref({
  "para Redes Sociales": ["#dabdff", "#c192ff", "purple"],
  "Audiovisual": ["#feaabc", "#fd7291", "pink"],
  "para Impresión": ["#dedede", "#c6c6c6", "grey"],
})

// Computed properties
const finalMats = computed(() => {
  const initialMats = props.blok ? props.blok.body : materials.value.body
  return initialMats
    .map(mat => {
      const dateCreated = dayjs(mat.created.substr(0, 10))
      mat.created_date = dateCreated
      mat.year = dateCreated.year()
      mat.colors = typeMaterials.value[mat.type_material]
      return mat
    })
    .sort((x, y) => d3.descending(x.created_date, y.created_date))
})

const allTypes = computed(() =>
  finalMats.value.reduce((arr, mat) => (!arr.includes(mat.type_material) ? [...arr, mat.type_material] : arr), []).map(type => ({
    name: type,
    colors: typeMaterials.value[type]
  }))
)

const filteredMats = computed(() => {
  if (!selectedMats.value.length) return finalMats.value
  const selectedTypes = allTypes.value.filter((_, idx) => selectedMats.value.includes(idx))
  return finalMats.value.filter(mat =>
    selectedTypes.some(selMat => selMat.name === mat.type_material)
  )
})
</script>

<template>
  <div class="pt-2">
    <div class="d-flex align-center">
      <span class="mr-2 text-subtitle-1">Filtrar materiales:</span>
      <v-chip-group multiple v-model="selectedMats">
        <v-chip
          v-for="typeMat in allTypes"
          :key="typeMat.name"
          class="mx-1"
          filter
          variant="outlined"
          :color="typeMat.colors[2]"
        >
          {{ typeMat.name }}
        </v-chip>
      </v-chip-group>
    </div>

    <v-card
      v-for="item in filteredMats"
      :key="item._uid"
      v-editable="item"
      class="my-6 pb-0 rounded-lg"
      :color="item.colors[0]"
    >
      <v-row justify="center" align="center">
        <v-col
          cols="auto"
          class="pl-3 pa-0 text-center shrink d-flex justify-center"
          align="center"
          justify="center"
          align-self="stretch"
          style="height: 100%;"
        >
          <v-card :color="item.colors[1]" class="rounded-lg">
            <v-img
              :src="resizeImg(item.cover, 200)"
              style="max-height: 200px; max-width: 200px;"
              aspect-ratio="0.95"
              dark
            ></v-img>
          </v-card>
        </v-col>

        <v-col class="pa-1 pa-sm-2 pa-md-3 grow">
          <v-card-subtitle class="text-subtitle-1 text-no-wrap pb-0 text-black pt-2">
            <span :class="`${item.colors[2]}--text`">
              Material {{ item.type_material }}
            </span> |
            <span class="text-grey-darken-1">{{ item.year }}</span>
          </v-card-subtitle>
          <v-card-title class="text-h5 text-no-wrap py-2 font-weight-bold">
            {{ item.name }}
          </v-card-title>
          <v-card-text v-if="item.description" class="text-black text-body-1 pb-2 montse">
            {{ item.description }}
          </v-card-text>
        </v-col>

        <v-col class="mx-4 mt-8 pa-1 pa-sm-2 pa-md-3 shrink d-flex flex-column align-center">
          <v-btn
            v-if="item.file_material?.filename"
            rounded
            variant="outlined"
            color="black"
            size="large"
            :href="item.file_material.filename"
            target="_blank"
            class="my-2"
            block
          >
            <v-icon class="mr-2">fa-file-download</v-icon>
            Descargar
          </v-btn>
          <v-btn
            v-if="item.link?.url"
            rounded
            variant="outlined"
            color="black"
            size="large"
            block
            :href="item.link.url"
            target="_blank"
            class="my-2"
          >
            <v-icon class="mr-2">fa-external-link-alt</v-icon>
            Visitar
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
