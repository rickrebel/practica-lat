<script setup>

import {useMainStore} from "~/store/index.js";
import {storeToRefs} from "pinia";
import PanelList from "~/components/dashboard/common/PanelList.vue";
import PanelsResult from "~/components/dashboard/common/PanelsResult.vue";

const mainStore = useMainStore()
const { schemas } = storeToRefs(mainStore)

const props = defineProps({
  full_main: {
    type: Object,
    required: true,
  },
  show_details: {
    type: Boolean,
    default: false,
  },
  collection_data: Object,
})

const final_filters = ref({page: 1, page_size: 40})

const child_collections = computed(() => {
  if (!props.collection_data)
    return []
  let collections = []
  props.collection_data.child_relation_fields.forEach(field => {
    const snake_name = field.related_snake_name
    const child_collection = schemas.value.collections_dict[snake_name]
    if (!child_collection)
      return
    const is_m2m = field.relation_type === 'many_to_many'
    if (is_m2m){
      if (props.collection_data.level === 'category_subtype'
          && child_collection.level === 'category_type')
        return
    }
    const results = props.full_main[`${snake_name}s`]
    const count = props.full_main[`${snake_name}s_count`]
    const has_count = count !== undefined && count !== null
    if (!is_m2m || results || has_count){
      collections.push({
        collection_data: child_collection,
        relation_id: field.id,
        count: count,
        results: results,
      })
    }
  })
  return collections
})

// const final_filters = computed(() => {
//   return {}
// })

</script>

<template>
  <v-card
    v-for="child_collection in child_collections"
    :key="child_collection.relation_id"
    class="mb-4"
  >
    <v-card-title class="d-flex">
      {{ child_collection.collection_data.plural_name }}
      <span v-if="child_collection.results" class="ml-2">
        ({{ child_collection.results.length }})
      </span>
      <span v-else class="text-error">
        Sin data heredada!!
      </span>
      <v-spacer></v-spacer>
      <v-btn
        v-if="false"
      >
        Agregar
      </v-btn>
    </v-card-title>
    <v-card-text v-if="child_collection.results">
      <PanelList
        :results="child_collection.results"
        :collection_data="child_collection.collection_data"
        :show_details="show_details"
      />
<!--      <PanelsResult-->
<!--        :results="child_collection.results"-->
<!--        :collection_data="child_collection.collection_data"-->
<!--        :show_details="show_details"-->
<!--        :final_filters="final_filters"-->
<!--        :total_count="child_collection.results.length"-->
<!--      />-->
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>