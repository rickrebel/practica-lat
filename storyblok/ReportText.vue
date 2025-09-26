<script setup>
import {computed, ref} from "vue";
import {useDisplay} from "vuetify";
const { mdAndUp } = useDisplay()
import {getDocumentType} from "~/composables/documents.js";

const props = defineProps({
  blok: Object,
  report_blok: Object,
})

const typeDocuments = ref({
  "Informe quincenal": ['#dabdff', '#c192ff', 'secondary'],
  "Informe final": ['#feaabc', '#fd7291', 'pink'],
  "Informe": ['#dabdff', '#c192ff', 'purple'],
  "Comunicado": ['#516fce', '#001249', 'info'],
})

const explanation = computed(() => {
  let rich_text = renderRichText(props.blok.text)
  if (!rich_text)
    return '-'
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse">')
  return rich_text
  // return renderRichText(props.blok.text)
})

const padding_top = computed(() => {
  let final_val = 0
  if (mdAndUp.value)
    final_val += 2
  if (props.blok.title)
    final_val += 2
  return `pt-${final_val}`
})

</script>

<template>
  <v-card
    v-editable="blok"
    elevation="6"
    class="pb-2 pb-md-4 mx-3"
  >
    <v-row class="mx-3 my-0" align="start">
      <v-col
        v-if="blok.title"
        cols="12"
        class="text-center d-flex justify-center"
      >
        <div>
          <v-sheet
            color="primary"
            class="px-5 py-1 font-weight-bold text-h5"
          >
            <div class="montse">
              {{blok.title}}
            </div>
          </v-sheet>
        </div>
      </v-col>
      <v-col
        cols="12"
        v-if="blok.text"
      >
        <div
          class="float-left my-6"
        >
        </div>

        <div
          v-html="explanation"
          class="text-text-1 text-sm-subtitle-1 _mt-2 _mt-sm-4 montse special-img"
          :class="{'text-justify' : blok.justify}"
          _class="{'text-justify' : blok.justify}"
        ></div>
      </v-col>
      <v-col
        v-if="blok.data_viz && blok.data_viz.length > 0"
        cols="12"
        align="center"
        class="px-0 px-md-3 text-left"
      >
        <StoryblokComponent
          v-for="nest_cont in blok.data_viz"
          :key="nest_cont._uid"
          :blok="nest_cont"
          :is="nest_cont.component"
          is_nest
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<style lang="scss" scoped>
.special-img {
  //background-color: red;
  p {
    color: blue;
    margin-top: 10px;
  }
}
p {
  background-color: green;
}

</style>
