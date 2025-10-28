<script setup>

// Props
const props = defineProps({
  blok: Object,
})


</script>

<template>
<!--  <SectionHeader-->
<!--    v-for="blok in blok?.header"-->
<!--    :key="blok._uid"-->
<!--    :blok="blok"-->
<!--    class="px-3"-->
<!--  />-->
  <DocumentList
    :blok="{
      ...blok,
      init_display: 120,
    }"
    :init_documents="blok.documents"
  />

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