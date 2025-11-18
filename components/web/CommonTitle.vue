<script setup>

const props = defineProps({
  blok: Object,
  is_main_title: Boolean,
})

const main_text = computed(() => {
  return props.is_main_title ? props.blok.header : props.blok.subheader
})

const final_align = computed(() => {
  return props.blok.align_title || props.blok.align_text || 'null'
})

const final_sm_align = computed(() => {
  return props.blok.align_title || props.blok.align_md || 'null'
})

const align_classes = computed(() => {
  if (props.blok.align_title)
    return `text-${props.blok.align_title} text-sm-${props.blok.align_title}`
  return `text-${final_align.value} text-sm-${final_sm_align.value}`
})

const text_size = computed(() => {
  return props.is_main_title
    ? 'text-h5 text-sm-h4 text-md-h3'
    : 'text-h6 text-sm-h5 text-md-h4'
})

</script>

<template>
  <v-card-title
    v-if="main_text"
    class="d-flex flex-column align-center pt-0"
    :class="`text-${blok.color_title || 'i'} ${align_classes} ${text_size}`"
  >
    <span
      class="montse title-no-wrap font-weight-bold"
      v-html="main_text"
      style="line-height: 1.2 !important;"
    >
    </span>
  </v-card-title>
</template>

<style scoped lang="scss">
.title-no-wrap{
  white-space: normal !important;
}
</style>