<script setup>
import {useMainStore} from "~/store/index.js";
import {storeToRefs} from "pinia";
const mainStore = useMainStore()
const { cats } = storeToRefs(mainStore)

const props = defineProps({
  final_filters: Object,
  field: String,
  label: {
    type: String,
    default: "Puesto",
  },
  filter_box: Object,
})

const items = computed(() => {
  // console.log("cats", cats.value)
  if (!cats.value) {
    return []
  }
  return cats.value.position
  // console.log("collections_summary", collections_summary.value)
  // const options = props.filter_box.options || []
  // return options.map((opt) => {
  //   return collections_summary.value[opt]
  // })
})

</script>

<template>
  <v-select
    v-model="final_filters[field]"
    :items="items"
    :label="label"
    item-title="short_name"
    item-value="id"
    clearable
    variant="underlined"
    density="compact"
    hide-details
    min-width="140"
    max-width="220"
  >
  </v-select>
</template>

<style scoped>

</style>