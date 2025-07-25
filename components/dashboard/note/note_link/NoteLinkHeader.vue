<script setup>

import HeaderCommon from "~/components/dashboard/generic/HeaderCommon.vue";
import {useMainStore} from "~/store/index.js";
import {storeToRefs} from "pinia";
import SelectGroup from "~/components/dashboard/common/SelectGroup.vue";
import ScrapeableChip from "~/components/dashboard/source/source/ScrapeableChip.vue";
const mainStore = useMainStore()
const { all_nodes } = storeToRefs(mainStore)
const props = defineProps({
  main: Object,
  collection_data: Object,
  show_details: {
    type: Boolean,
    default: false,
  },
})

const node_source = computed(() => {
  if (props.main.source){
    return all_nodes.value.sources.find(
      d => d.id === `subtype_${props.main.source}`)
  }
  return null
})

const dont_need = computed(() => {
  if (node_source.value){
    // console.log("node", node)
    return node_source.value.parent.data.name === 'Extranjera'
  }
  else
    return false
})

const final_main = computed(() => {
  if (typeof props.main.source === 'object') {
    return {
      source: props.main.source.id,
    }
  }
  return props.main
})

</script>

<template>
  <HeaderCommon
    :main="main"
    :show_details="show_details"
    :collection_data="collection_data"
  >
    <template #details>
<!--      <div style="max-width: 400px;" v-if="dfi_obj">-->
      <div style="max-width: 400px;" class="d-flex">
        <div>
          <v-card :variant="dont_need ? 'text' : 'outlined'" color="accent">
            <SelectGroup
              v-if="main.valid_option"
              filter_group_name="valid_options"
              :main_object="main"
              main_collection_name="note_link"
              is_display
            />
            <v-chip
              v-else-if="dont_need"
              class="mr-2"
              size="small"
              color="grey"
              label
            >
              No necesario
            </v-chip>
            <v-chip
              v-else
              class="mr-2"
              size="small"
              color="warning"
              label
              prepend-icon="warning"
            >
              No clasificado
            </v-chip>
          </v-card>
          <div v-if="!dont_need" class="mt-1">
            <SelectGroup
              v-if="main.pre_valid_option"
              filter_group_name="valid_options"
              :main_object="main"
              main_collection_name="note_link"
              field="pre_valid_option"
              is_display
            />
            <v-chip
              v-else
              class="mr-2"
              size="small"
              color="warning"
              label
              prepend-icon="warning"
            >
              No clasificado
            </v-chip>
          </div>
        </div>

        <div class="d-flex align-center">
          <SelectGroup
            filter_group_name="sources"
            :main_object="final_main"
            main_collection_name="source"
            is_display
          />
          <ScrapeableChip
            v-if="node_source"
            :main="node_source.data"
            is_icon
          />
        </div>

      </div>
    </template>
  </HeaderCommon>
</template>

<style scoped>

</style>