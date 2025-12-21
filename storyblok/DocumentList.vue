<script setup>

import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
const swiper_modules = [Navigation, Pagination, Autoplay, EffectCoverflow];
// const swiper_modules = [Pagination];

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {useWebStore} from '~/store/web.ts'
import {getDocumentType} from "~/composables/documents.js";

import Document from "~/storyblok/Document.vue"

dayjs.locale('es')

const webStore = useWebStore()
// Store setup and state
const { all_documents, global_config } = storeToRefs(webStore)
// Props
const props = defineProps({
  blok: Object,
  init_documents: Array,
})

// Data equivalent with refs
const selected_months = ref([])
const selectedDocs = ref([])
const show_all = ref(false)

const final_display = computed(()=>{
  return props.blok
    ? Number(props.blok.init_display || 8)
    : 300
})

const pagination = {
  clickable: true,
  bulletClass: 'large-bullet swiper-pagination-bullet',
  clickableClass: 'outside-pagination swiper-pagination-clickable',
}

// Computed properties
const final_docs = computed(() => {
  // console.log("documents.value", documents.value)
  // return []
  const initialDocs = props.init_documents ||
    props.blok?.body || all_documents.value
  // console.log("initialDocs", initialDocs)
  if (!initialDocs)
    return []
  return initialDocs
    .map(doc => {
      // console.log("doc", doc)
      doc.document_type = getDocumentType(doc.type_doc)
      doc.colors = doc.document_type.colors
      // const date_start = dayjs(doc.start_date.substr(0, 10))
      // doc.date_start = date_start
      // doc.year = date_start.year()
      // doc.month = date_start.month()
      // doc.month_year = date_start.format('MMMM YYYY')
      let date_text = ''
      // let date_month = date_start.format('MMMM-YYYY')
      // date_text = date_start.format('D/MMM/YYYY')
      // doc.created_format = date_start.format('D [de] MMMM [de] YYYY')
      // doc.date_text = date_text
      // doc.date_month = date_month
      return doc
    })
    // .sort((x, y) => d3.descending(x.date_start, y.date_start))
})

const all_months = computed(() =>
  final_docs.value.reduce((arr, doc) =>(
    !arr.includes(doc.month_year) ? [...arr, doc.month_year] : arr
  ), [])
)

const all_types = computed(() =>
  final_docs.value.reduce((arr, doc) => (
    !arr.includes(doc.type_doc)
      ? [...arr, doc.type_doc]
      : arr), []
  ).map((type) => {
    const document_type = getDocumentType(type)
    return {
      ...document_type,
      key: type,
    }
    // colors: typeDocuments[type]
  })
)

const filteredDocs = computed(() => {
  const selected_month_list = selected_months.value.length
    ? all_months.value.filter((month, idx) => selected_months.value.includes(idx))
    : all_months.value
  const selectedDocList = selectedDocs.value.length
    ? all_types.value.filter((_, idx) => selectedDocs.value.includes(idx))
    : all_types.value
  let filtered_docs = final_docs.value.filter(
    doc =>
      selectedDocList.some(selDoc => selDoc.key === doc.type_doc) &&
      selected_month_list.includes(doc.month_year)
  )
  // console.log('filtered_docs', filtered_docs)
  if (!show_all.value)
    return filtered_docs.slice(0, final_display.value)
  return filtered_docs
})

</script>

<template>
  <SectionHeader
    v-for="blok in blok?.header"
    :key="blok._uid"
    :blok="blok"
    class="px-3"
  />
  <v-card
    v-editable="blok"
    style="width: 100% max-width: 100%;"
    class="px-3 pb-4 pb-md-8"
    variant="flat"
    color="transparent"
  >
<!--    cookieLang: {{cookieLang || 'no-lang'}} |-->
<!--    language: {{language}}-->
<!--    <div-->
<!--      class="d-flex justify-center align-center flex-column flex-md-row"-->
<!--    >-->

<!--      <div-->
<!--        class="mr-2 text-sm-subtitle-1 text-body-1 text-grey-darken-2"-->
<!--        v-if="smAndUp"-->
<!--      >-->
<!--        Filtrar meses:-->
<!--      </div>-->
<!--      <v-chip-group-->
<!--        v-if="smAndUp"-->
<!--        multiple-->
<!--        v-model="selected_months"-->
<!--      >-->
<!--        <v-chip-->
<!--          v-for="month in all_months"-->
<!--          :key="month"-->
<!--          class="mx-1"-->
<!--          filter-->
<!--          variant="outlined"-->
<!--          color="accent"-->
<!--        >-->
<!--          {{ month }}-->
<!--        </v-chip>-->
<!--      </v-chip-group>-->

<!--      <span class="mr-2 text-subtitle-1 ml-4">Filtrar documentos:</span>-->
<!--      <v-chip-group multiple v-model="selectedDocs">-->
<!--        <v-chip-->
<!--          v-for="typeDoc in all_types"-->
<!--          :key="typeDoc.name"-->
<!--          class="mx-1"-->
<!--          filter-->
<!--          variant="outlined"-->
<!--          :color="typeDoc.colors[2]"-->
<!--        >-->
<!--          {{ typeDoc.name }}-->
<!--        </v-chip>-->
<!--      </v-chip-group>-->
<!--    </div>-->
    <Swiper
      :modules="swiper_modules"
      slides-per-view="auto"
      space-between="24"
      :navigation="true"
      :pagination="pagination"
      :autoplay="{ delay: 4000, disableOnInteraction: true }"
      class="pb-12"
    >
      <SwiperSlide
        v-for="(item, idx) in filteredDocs"
        :key="item._uid"
        style="width: 300px;"
      >
        <Document
          :item="item"
          :idx="idx"
          :download_title="global_config?.download_title || 'Descargar'"
        />
      </SwiperSlide>
    </Swiper>
  </v-card>
</template>

<style scoped lang="scss">

:deep(.large-bullet) {
  width: 16px;
  height: 16px;
  margin-left: 6px !important;
  margin-right: 6px !important;
  background-color: #e7e7e7 !important;
}

:deep(.outside-pagination) {
  bottom: -2px !important;
  //margin-top: 20px !important;
}

</style>