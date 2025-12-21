<script setup>
import {computed} from "vue";

const props = defineProps({
  item: Object,
  blok: Object,
  idx: Number,
  download_title: {
    type: String,
    default: 'Descargar'
  }
})

import { useDisplay } from 'vuetify'
const { xs, mdAndUp } = useDisplay()
import { currentLocale } from "~/composables/locales.js"

const color = computed(() => {
  if (!props.item.colors) return 'primary'
  return props.item.colors[0]
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
      <v-spacer></v-spacer>
      <v-card-subtitle
        v-if="item.subtitle"
        class="text-subtitle-1 text-center title-no-wrap pb-0 font-weight-bold text-grey-darken-2"
      >
        {{ item.subtitle }}
      </v-card-subtitle>
      <v-card-title
        class="text-h6 text-center title-no-wrap pt-0 font-weight-bold montse pointer"
        style="line-height: 1.25"
      >
        <NuxtLink
          v-if="item.slug"
          :to="`/${currentLocale}/report/${item.slug}`"
          class="text-decoration-none text-black"
        >
          {{ item.name }}
        </NuxtLink>
        <NuxtLink
          v-else
          @click.prevent="openDoc(item)"
          class="text-decoration-none text-black"
        >
          {{ item.name }}
        </NuxtLink>
      </v-card-title>
      <v-spacer></v-spacer>
      <v-divider class="my-2" >
      </v-divider>
      <v-card-actions
        v-if="item.slug"
        class="pt-auto pb-3"
      >
  <!--          <NuxtLink-->
  <!--            :to="`/${item.full_slug}`"-->
  <!--            class="text-decoration-none"-->
  <!--          >-->
        <v-icon-btn
          color="accent"
          variant="elevated"
          size="large"
          v-tooltip="download_title"
          @click="openDoc(item)"
        >
          <v-icon>download</v-icon>
        </v-icon-btn>
<!--        <v-btn-text-->
<!--          @click="openDoc(item)"-->
<!--          variant="elevated"-->
<!--          color="accent"-->
<!--          icon="download"-->
<!--          :block="!mdAndUp"-->
<!--          v-tooltip="'Descargar'"-->
<!--          class="px-1"-->
<!--        >-->
<!--        </v-btn-text>-->
        <v-spacer></v-spacer>
        <v-card-subtitle
          class="text-subtitle-1 title-no-wrap text-black"
        >
          <span class="text-body-2">
            {{ item.date_month }}
          </span>
        </v-card-subtitle>

        <v-spacer></v-spacer>
        <v-icon-btn
          v-if="item.slug"
          :to="`/${currentLocale}/report/${item.slug}`"
          color="accent"
          variant="tonal"
          elevation="4"
          size="large"
          icon="visibility"
          v-tooltip="'Explorar documento'"
        >
        </v-icon-btn>

<!--        <v-btn-text-->
<!--          :to="`/${item.full_slug}`"-->
<!--          variant="text"-->
<!--          color="accent"-->
<!--          icon="visibility"-->
<!--          elevation="4"-->
<!--          :block="!mdAndUp"-->
<!--          v-tooltip="'Explorar documento'"-->
<!--        >-->
<!--        </v-btn-text>-->
      </v-card-actions>
      <v-card-actions
        v-else
        class="pt-auto pb-3"
      >
        <v-spacer></v-spacer>
        <v-btn-primary
          color="accent"
          variant="elevated"
          @click="openDoc(item)"
          append-icon="download"
        >
          {{ download_title }}
        </v-btn-primary>
        <v-spacer></v-spacer>

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