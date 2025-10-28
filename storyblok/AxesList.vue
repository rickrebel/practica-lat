<script setup>
import {storeToRefs} from "pinia";
import {useWebStore} from "~/store/web.js";

const webStore = useWebStore()
const { all_axes } = storeToRefs(webStore)

const props = defineProps({
  blok: Object,
})

const final_axes = computed(() => {

  // return all_axes.value.filter(
  //   axis => props.blok.axes.includes(axis.uuid)
  // )
  return props.blok.axes.map(
    axis_id => all_axes.value.find(axis => axis.uuid === axis_id)
  ).filter(axis => axis)
})


</script>

<template>
  <v-row
    justify="space-around"
    align="center"
    align-content="center"
    class="mx-3"
    v-editable="blok"
    no-gutters
  >
    <v-col
      v-for="axis in final_axes"
      :key="axis._uid"
      cols="12"
    >
      <Axis
        :blok="axis.content"
        :story="axis"
        :is_editable="false"
      />

    </v-col>

  </v-row>

</template>

<style scoped lang="scss">

</style>
