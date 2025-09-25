<script setup>
import { resizeImg } from '~/composables/storyblok_images.js'
import dayjs from "dayjs";
const props = defineProps({
  item: Object,
  blok: Object,
})
import { useDisplay } from 'vuetify'
const { xs, mdAndUp } = useDisplay()

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
    color="white"
    v-editable="item"
    variant="flat"
    class="outlined-card"
    tile
  >
    <div class="d-flex _flex-no-wrap flex-column">
      <v-sheet
        color="primary"
        class="full-height d-flex justify-center align-center"
      >
        <v-img
          :aspect-ratio="1"
          :src="resizeImg(item.cover, 140)"
          max-height="240"
          cover
        ></v-img>
      </v-sheet>
      <div class="mx-6 mt-6">
        <v-btn
          variant="flat"
          color="accent"
          @click="openDoc(item)"
          icon="description"
          v-tooltip="'Decargar documento'"
        ></v-btn>
      </div>

      <div class="pt-6">
        <v-card-subtitle
          v-if="item.subtitle"
          class="text-subtitle-1 title-no-wrap pb-0 font-weight-bold text-primary"
        >
          {{ item.subtitle }}
        </v-card-subtitle>
        <v-card-title
          class="text-h6 title-no-wrap pt-0 font-weight-bold montse pointer mx-3"
        >
          <NuxtLink
            :to="`/${item.full_slug}`"
            class="text-decoration-none oswald text-black"
            _class="`text-${item.colors[2]}`"
          >
            {{ item.name }}
          </NuxtLink>
        </v-card-title>
        <v-card-subtitle
          class="text-subtitle-1 title-no-wrap pb-6 text-black mx-3"
        >
          <v-chip
            v-if="!item.type_doc.includes('quincenal')"
            size="small"
            variant="outlined"
            class="mr-2"
          >
            {{ item.document_type.name }}
          </v-chip>
          <span
            v-if="!item.type_doc.includes('quincenal') && false"
            :class="`text-pinked`"
          >{{ item.type_doc }} |</span>
          <span class="text-body-2">
            {{ item.date_text }}
          </span>
        </v-card-subtitle>
        <v-divider class="my-2" >
        </v-divider>
        <v-card-actions class="pb-4">
<!--          <NuxtLink-->
<!--            :to="`/${item.full_slug}`"-->
<!--            class="text-decoration-none"-->
<!--          >-->
          <v-btn-text
            :to="`/${item.full_slug}`"
            variant="text"
            color="accent"
            prepend-icon="visibility"
            :block="!mdAndUp"
          >
            Visualizar
          </v-btn-text>
<!--          </NuxtLink>-->
<!--          <template v-if="mdAndUp">-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-btn-->
<!--              _rounded="lg"-->
<!--              variant="flat"-->
<!--              color="accent"-->
<!--              @click="openDoc(item)"-->
<!--              icon="file_download"-->
<!--              v-tooltip="'Decargar documento'"-->
<!--            ></v-btn>-->
<!--          </template>-->
        </v-card-actions>

      </div>
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