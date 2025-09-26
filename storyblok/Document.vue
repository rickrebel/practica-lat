<script setup>
import {computed} from "vue";

const props = defineProps({
  item: Object,
  blok: Object,
  idx: Number,
})
import { useDisplay } from 'vuetify'
const { xs, mdAndUp } = useDisplay()
const route = useRoute()
const cookieLang = useCookie('user_lang')

const color = computed(() => {
  if (!props.item.colors) return 'primary'
  return props.item.colors[0]
})

const language = computed(() => {
  let lang = cookieLang.value
  if (!lang)
    lang = route.params.lang || 'es'
  return lang
})

function openDoc(item) {
  if (!item.file_doc) return
  window.open(item.file_doc.filename, '_blank')
}

</script>

<template>
  <v-card
    v-if="item"
    v-editable="item"
    variant="text"
    color="transparent"
    class="outlined-card pt-3"
    :class="`dynamic-background${idx%2 === 0 ? '' : '-dark'}`"
    tile
    height="260"
  >
    <svg
      _v-if="blok.use_grandient"
      class="texture-background"
    >
      <rect width="100%" height="100%" />
    </svg>
    <div class="content d-flex flex-column justify-space-between">
      <v-card-subtitle
        v-if="item.subtitle"
        class="text-subtitle-2 title-no-wrap pb-0 font-weight-bold text-primary"
      >
        {{ item.subtitle }}
      </v-card-subtitle>
      <v-card-title
        class="text-subtitle-1 title-no-wrap pt-0 font-weight-bold montse pointer"
        style="line-height: 1.25"
      >
        <NuxtLink
          :to="`/${language}/${item.full_slug}`"
          class="text-decoration-none text-black"
        >
          {{ item.name }}
        </NuxtLink>
      </v-card-title>
      <v-card-subtitle
        class="text-subtitle-1 title-no-wrap text-black"
      >
        <span class="text-body-2">
          {{ item.date_month }}
        </span>
      </v-card-subtitle>
      <v-spacer></v-spacer>
      <v-divider class="my-2" >
      </v-divider>
      <v-card-actions class="pt-auto pb-3">
  <!--          <NuxtLink-->
  <!--            :to="`/${item.full_slug}`"-->
  <!--            class="text-decoration-none"-->
  <!--          >-->
        <v-btn-text
          @click="openDoc(item)"
          variant="elevated"
          color="accent"
          icon="download"
          :block="!mdAndUp"
          v-tooltip="'Descargar'"
        >
        </v-btn-text>
        <v-spacer></v-spacer>
        <v-btn-text
          :to="`/${item.full_slug}`"
          variant="text"
          color="accent"
          icon="visibility"
          elevation="4"
          :block="!mdAndUp"
          v-tooltip="'Explorar documento'"
        >
        </v-btn-text>
      </v-card-actions>
    </div>

  </v-card>
</template>

<style scoped lang="scss">

.title-no-wrap{
  white-space: normal !important;
}

.white-outlined {
  border: 3px solid white !important;
}

.outlined-card {
  border: 1px solid #bbbbbb !important;
}


</style>