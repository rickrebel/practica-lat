<script setup>

import ScrapeableChip from "~/components/dashboard/source/source/ScrapeableChip.vue";
const mainStore = useMainStore()
import {storeToRefs} from "pinia";
import {useMainStore} from "~/store/index.js";
const {
  schemas,
  cats,
  all_nodes
} = storeToRefs(mainStore)

const props = defineProps({
  pre_source: {
    type: Object,
    required: false,
  },
  source_id: Number,
  is_test: Boolean,
})

const saving_source = ref(false)
const source_errors = ref(null)
const source_origin = ref(null)

const emits = defineEmits(['show_snackbar'])

const source_collection_data = computed(() => {
  return schemas.value.collections_dict['source']
})

const full_source = computed(() => {
  // console.log("node_source", node_source.value)
  return props.pre_source || node_source.value?.data || {}
})

const node_source = computed(() => {
  if (props.source_id){
    return all_nodes.value.sources.find(
      d => d.id === `subtype_${props.source_id}`)
  }
  return null
})

// const changeNational = (value) => {
const changeOrigin = (value) => {
  // console.log("changeOrigin", value)
  // console.log("result.gnews_source", props.full_main.gnews_source)
  // // const gnews_source = props.full_main.gnews_source
  // console.log("result.source", props.full_main.source)
  const params = {
    // ...{"main_url": gnews_source.href, "name": gnews_source.title},
    ...full_source.value,
    source_origin: value,
    // national: value,
  }
  saving_source.value = true
  source_errors.value = null
  saveElement(source_collection_data.value, params).then((res) => {
    // console.log('res', res)
    // emits('item-saved', {res, is_new})
    if (res.errors) {
      source_errors.value = res.errors
      saving_source.value = false
      return
    }
    source_origin.value = res.source_origin
    emits('show_snackbar')
    saving_source.value = false
  })
}

</script>

<template>
  <span class="text-cyan-darken-2 text-subtitle-1 mr-2 font-weight-bold">
    {{full_source.name}}
  </span>
  <span class="text-black text-caption">
    ({{full_source.main_url}})
  </span>
  <v-btn-toggle
    v-if="!is_test"
    v-model="source_origin"
    :model-value="full_source.source_origin"
    color="accent"
    class="ml-2"
    border
    divided
    density="compact"
    variant="elevated"
    @update:model-value="changeOrigin"
  >
    <v-btn
      v-for="choice in cats.source_origin"
      :key="choice.id"
      :value="choice.id"
      :color="choice.color"
      :loading="saving_source"
      size="small"
    >
      {{choice.name}}
    </v-btn>
  </v-btn-toggle>
  <v-chip
    v-else-if="pre_source?.source_origin"
    :color="pre_source.source_origin.color"
    class="ml-2"
    variant="elevated"
  >
    {{pre_source.source_origin.name}}
  </v-chip>
  <ScrapeableChip
    v-if="full_source.id"
    :main="full_source"
  />
</template>

<style scoped>

</style>