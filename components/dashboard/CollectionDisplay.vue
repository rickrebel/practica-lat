<script setup>
import {computed, onMounted, ref, onBeforeMount, watch, nextTick } from "vue";
import {useMainStore} from '~/store/index'
import SelectFilters from "~/components/dashboard/common/SelectFilters.vue";
import PanelResult from "~/components/dashboard/common/PanelsResult.vue";
import {final_sorts, status_filters} from "~/composables/filters.js";

import {storeToRefs} from "pinia";
import ExportButton from "~/components/dashboard/generic/ExportButton.vue";
import _debounce from "lodash/debounce.js";

const mainStore = useMainStore()

const {
  schemas,
  current_collection_data,
} = storeToRefs(mainStore)
const { fetchElements } = mainStore

const props = defineProps({
  parent_collection: Object,
  level_name: String,
  filter_group: Object,
  is_mini: Boolean,
})

const init_filters = {
  status_register: null,
}

const results = ref([])
const q_value = ref("")
const loading_fetch = ref(false)
const show_details = ref(false)
const total_count = ref(0)
const final_filters = ref({
  ordering: null,
  q: "",
  page_size: 40,
  ...init_filters,
})

const temp_reset = ref(false)
const visible_filters = ref([])
const current_filters = ref([])
// const panel_result = useTemplateRef('panel-result')
const childRef = ref(null)
const emits = defineEmits(['select-item'])

onBeforeMount(() => {
  // console.log("beforeMount")
  resetFilters()
})

onMounted(() => {
  initFilters()
})

const collection_data = computed(() => {
  return props.parent_collection || current_collection_data.value
})
const simplified_filters = computed(() =>{
  return current_filters.value.length <= 3
})

watch(
  final_filters, (val) => {
    // console.log("final_filters", val)
    if (!temp_reset.value)
      applyFilters()
    else
      temp_reset.value = false
  },
  {deep: true},
)

watch(
  q_value, (val) => {
    debounceApplyFilters()
  }

)

const is_category = computed(() =>{
  // console.log("collection_data.value.level", collection_data.value)
  // return props.parent_collection || current_collection_data.value
  // console.log("parent_collection", props.parent_collection)
  // console.log("current_collection_data", current_collection_data.value)
  return collection_data.value.level.includes('category')
})

const debounceApplyFilters = _debounce(() => {
  applyFilters()
}, 800)

function applyFilters(page=null) {
  if (page === null){
    page = 1
    if (childRef.value)
      childRef.value.resetPage()
  }
  loading_fetch.value = true
  show_details.value = false
  let collection_name = collection_data.value.snake_name
  if (is_category.value)
    collection_name = `catalogs/${collection_name}`
  results.value = []
  const params = {...final_filters.value, q: q_value.value, page: page}
  fetchElements([collection_name, params]).then(res => {
    loading_fetch.value = false
    if (!res.results){
      total_count.value = res.length
      results.value = res
    }
    else{
      total_count.value = res.total
      results.value = res.results
    }
    changeShowDetails()
  })
}

function changeShowDetails() {
  nextTick(() => {
    setTimeout(() => {
      show_details.value = true
    }, 10)
  })
}

function resetFilters() {
  if (!is_category.value && !collection_data.value.cat_params?.init_display)
    temp_reset.value = true
  final_filters.value = {
    ordering: null,
    q: "",
    page_size: 40,
  }
  results.value = []
  total_count.value = 0
  show_details.value = false
  loading_fetch.value = false
  visible_filters.value = []
}

function initFilters() {
  // console.log("changeFilters", collection_data.value)
  if (!collection_data.value)
    return
  const all_filters = collection_data.value.all_filters || []
  // console.log("all_filters", all_filters)
  // console.log("collection_data", collection_data.value)
  // console.log("level_name", props.level_name)
  // console.log("filter_group", props.filter_group)
  let collection_filters = all_filters.reduce((arr, f) => {
    // console.log("filter_name", f.filter_name)
    // console.log("f", f)
    if (!f.filter_name){
      console.log("custom_filter", f)
      let custom_filter = {
        is_custom: true,
        order: 12,
      }
      arr.push({...f, ...custom_filter})
      return arr
    }
    const filter_data = schemas.value.filters_dict[f.filter_name]

    const new_filter = {...filter_data, ...f}
    if (filter_data.category_group){
      // console.log("filter_data", filter_data)
      // console.log("new_filter", new_filter)
      filter_data.category_groups.forEach(cg => {
        const short_name = `${new_filter.short_prev} ${cg.name}`
        const name = `${new_filter.prev} ${cg.name}`
        let current_filter = {
          name, short_name, category_group_value: cg.id}
        // console.log("result", {...new_filter, ...cg, ...current_filter})
        arr.push({...new_filter, ...cg, ...current_filter})
      })
      return arr
    }
    arr.push(new_filter)
    return arr
  }, [])
  // console.log("collection_filters", collection_filters)
  if (props.filter_group){
    // console.log("filter_group", props.filter_group)
    const fg = props.filter_group
    const new_filter_group = {
      ...props.filter_group,
      short_name: `${fg.short_prev} ${fg.name}`,
      name: `${fg.prev} ${fg.name}`,
      forced_level: props.level_name,
    }
    collection_filters.push(new_filter_group)
  }
  const status_groups = collection_data.value.status_groups || []
  status_groups.forEach(sg => {
    collection_filters.push(status_filters[sg])
  })

  current_filters.value = collection_filters

  // console.log("group in changeFilters", group)
  if (collection_filters.length <= 3)
    visible_filters.value = current_filters.value
  else
    visible_filters.value = current_filters.value.filter(f => !f.hidden)
  // console.log("visible_filters", visible_filters.value)
  // console.log("collection_data", collection_data.value)
}

function addItem() {
  childRef.value.addItem()
  // console.log("addItem in CollectionDisplay")
  // console.log("panel_result", panel_result)
  // const ref_panel_result = panel_result.value
  // console.log("ref_panel_result", ref_panel_result)
  // ref_panel_result.addItem()
}
function selectItem(item) {
  emits('select-item', item)
}


</script>

<template>
  <v-card class="pt-3" flat style="width: 100%;">
    <template v-if="is_mini">
      <v-card-title class="text-h5 d-flex align-center">
        Busca y elige un {{ collection_data.name }}
        <v-spacer></v-spacer>
        <v-btn
          icon="close"
          variant="text"
          @click="emits('select-item', null)"
        >
        </v-btn>
      </v-card-title>
      <v-card-subtitle class="d-flex align-center">
        Si no encuentras el {{ collection_data.name }}, puedes crear uno nuevo.
        <v-spacer></v-spacer>
      </v-card-subtitle>
    </template>
    <v-row class="mx-0" v-if="collection_data">
      <v-col cols="12" _class="py-0" v-if="!simplified_filters">
        <v-chip-group
          v-model="visible_filters"
          multiple
          column
          color="blue"
        >
          <v-chip
            v-for="filter in current_filters"
            :key="filter.key_name"
            :label="!filter.collection"
            :value="filter"
            :disabled="filter.disabled"
            class="mr-1 py-1"
            filter
            variant="tonal"
          >
            {{filter.short_name || filter.name}}
          </v-chip>
        </v-chip-group>
      </v-col>
      <SelectFilters
        v-if="!simplified_filters"
        :final_filters="final_filters"
        :visible_filters="visible_filters"
      />
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="d-flex mb-2 mt-0"
        :order="simplified_filters ? 1 : 'last'"
      >
<!--          v-model="final_filters.q"-->
        <v-text-field
          v-model="q_value"
          :label="`Buscar ${collection_data.plural_name || 'elementos'}`"
          outlined
          density="comfortable"
          clearable
          base-color="blue"
          color="indigo"
          _bg-color="grey lighten-2"
          variant="underlined"
          hide-details
          max-width="300"
          min-width="200"
          append-inner-icon="search"
          @click:append-inner="applyFilters()"
        ></v-text-field>
        <v-select
          v-if="final_sorts.length"
          v-model="final_filters.ordering"
          :items="final_sorts"
          item-title="title"
          item-value="value"
          label="Ordenar por"
          density="comfortable"
          variant="underlined"
          hide-details
          class="ml-3"
          style="max-width: 220px;"
        ></v-select>
        <SelectFilters
          v-if="simplified_filters"
          :final_filters="final_filters"
          :visible_filters="visible_filters"
        />
        <v-spacer></v-spacer>
<!--        <v-btn-->
<!--          color="accent"-->
<!--          variant="outlined"-->
<!--          text="Mostrar acciones"-->
<!--          class="mr-3"-->
<!--          @click="changeGroupActions"-->
<!--        ></v-btn>-->
        <v-col cols="auto" order="12">
          <ExportButton
            v-if="collection_data.level === 'primary' && !is_mini"
          />
          <v-btn
            v-else-if="is_mini"
            color="accent"
            @click="addItem"
            class="mr-3"
          >
            <v-icon>add</v-icon>
            Agregar {{ collection_data.name }}
          </v-btn>
        </v-col>
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="loading_fetch"
      indeterminate
      height="10"
      color="accent"
    ></v-progress-linear>
    <PanelResult
      :results="results"
      :collection_data="collection_data"
      :show_details="show_details"
      :final_filters="final_filters"
      @update-page-number="applyFilters($event)"
      :total_count="total_count"
      :is_mini="is_mini"
      ref="childRef"
      @select-item="selectItem"
    />
  </v-card>
</template>
