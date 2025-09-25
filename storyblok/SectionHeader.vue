<script setup>

import CommonTitle from "../components/web/CommonTitle.vue";
import {resizeImg} from "~/composables/storyblok_images.js";

const props = defineProps({
  blok: Object,
  report_blok: Object,
})

function openDoc(item) {
  console.log('item', item)
  if (!item.file_doc) return
  window.open(item.file_doc.filename, '_blank')
}
</script>

<template>
  <v-col
    v-editable="blok"
    cols="12"
    class="section-header mb-1 pt-3 d-flex justify-space-between"
    :class="{report_block: 'text-center'}"
  >
    <v-card
      v-if="report_blok?.cover?.filename"
      width="340"
      class="white-outlined ml-2 ml-sm-10 mr-2"
      color="transparent"
      rounded="xl"
    >
      <v-img
        :aspect-ratio="1"
        :src="resizeImg(report_blok.cover, 350)"
        class="ma-3"
      ></v-img>
    </v-card>
    <v-spacer v-else-if="!blok.left_align"></v-spacer>
    <div class="d-flex flex-column">
<!--      <div-->
<!--        class="text-uppercase text-body-2 text-grey-darken-2 px-4"-->
<!--        :class="report_blok ? '' : 'mb-4'"-->
<!--      >-->
<!--        {{blok.header}}-->
<!--      </div>-->
      <CommonTitle
        :blok="blok"
        is_main_title
      />
      <CommonTitle
        :blok="blok"
      />
      <template v-if="blok.explanation">
        <v-divider class="mt-0  mx-auto"/>
        <p
          class="text-h6 font-weight-light mx-4 pb-6"
          style="max-width: 700px;"
          v-text="blok.explanation"
        />
      </template>
      <v-btn
        v-if="report_blok"
        variant="elevated"
        color="accent"
        size="large"
        class="white-outlined px-5 mx-4 mt-4 align-self-start"
        v-tooltip="'Descargar'"
        rounded="lg"
        append-icon="file_download"
        @click="openDoc(report_blok)"
      >
        Descargar
      </v-btn>
    </div>
    <v-spacer></v-spacer>

  </v-col>
</template>

<style lang="scss">
.side-title{
  width: 50px;
  height: 8px;
}

.section-header {
  //font-family: Lato;

  .v-divider {
    border-width: 1px;
    max-width: 50px;
  }

  .poppins {
    //font-family: Poppins !important;
  }
}

.white-outlined {
  border: 3px solid white !important;
}
</style>