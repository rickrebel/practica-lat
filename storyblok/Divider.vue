<script setup>
import { computed } from "vue";
const props = defineProps({
  blok: Object
})
const margins = computed(() => {
  if (props.blok.tipo === 'large')
    return 'my-9'
  else if (props.blok.tipo === 'small')
    return 'my-2'
  else
    return 'my-5'
})

</script>

<template>
  <v-col
    v-editable="blok"
    cols="12"
    :order="blok.order || 1"
    :order-md="blok.order_md || 1"
    :order-sm="blok.order_sm || 1"
    :class="margins"
  >
    <v-divider v-if="blok.has_divider"></v-divider>
  </v-col>
</template>
