<script setup>
import { useDisplay } from 'vuetify'
import {computed, ref} from "vue";
const { xs } = useDisplay()
import { calcFinalUrl } from '~/composables/final_url.ts'
import { currentLocale } from "~/composables/locales.js"
const { query } = useRoute()

const props = defineProps({
  blok: Object
})

const dialog = ref(false)

const size = computed(() =>
  // :x-large="$breakpoint.is.smAndUp && blok.size == 'x-large'"
  // :large="($breakpoint.is.xs && blok.size == 'x-large') || blok.size == 'large'"
  // :small="blok.size == 'x-large'"
  props.blok.size === 'x-large'
    ? (xs.value ? 'x-large' : undefined)
    : 'large'
)
const variant = computed(() =>
  // :outlined="blok.style == 'outlined'"
  // :text="blok.style == 'text'"
  props.blok.style === 'outlined'
    ? 'outlined'
    : props.blok.style === 'text'
    ? 'text'
    : 'elevated'
)

function openDialog() {
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

const dialog_text = computed(() => {
  let rich_text = renderRichText(props.blok.dialog_text)
  if (!rich_text)
    return '-'
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse">')
  return rich_text
})

const dialog_text_simple = computed(() => {
  return renderRichText(props.blok.dialog_text)
})

const is_storyblok = computed(() => {
  return query._storyblok || false
})

const final_url = computed(() => {
  // console.log('query', query)
  if (!props.blok.to)
    return null
  return calcFinalUrl(props.blok, currentLocale.value)
})

</script>

<template>
  <client-only>
    <v-btn-primary
      v-if="blok.is_dialog"
      :variant="variant"
      :color="blok.color || 'accent'"
      :size="blok.size || 'large'"
      class="mx-2 text-weight-bold"
      @click="openDialog"
      style="font-weight: bold;"
      :append-icon="blok.icon || 'add'"
    >
      {{blok.button_title}}
      <v-dialog
        v-model="dialog"
        max-width="850"
      >
        <v-card class="rounded-xl">
          <v-card
            class="d-flex justify-center align-center"
            elevation="6"
            height="80"
            color="accent"
          >
            <div
              class="text-h4 py-2"
            >
              {{ blok.dialog_title || 'Título' }}
            </div>
          </v-card>
          <v-card-text style="min-height: 300px" class="my-3">
  <!--          <MaterialList v-if="blok.display_list === 'Materials'" />-->
  <!--          <DocumentList v-else-if="blok.display_list === 'OfficialDocs'" />-->
            <span
              v-html="dialog_text"
              class="montse"
              :class="`text-${blok.align_text}`"
            >

            </span>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-btn-primary>
    <v-btn-menu
      v-else-if="blok.behavior === 'menu'"
      :variant="variant"
      color="secondary"
      size="default"
      :to="blok.to.cached_url || blok.to.url"
      :append-icon="blok.icon || 'add'"
    >
      {{blok.button_title}}
    </v-btn-menu>
    <template v-else>
      <v-menu v-if="is_storyblok">
        <template v-slot:activator="{ props }">
          <v-btn-primary
            v-bind="props"
            :variant="variant"
            :color="blok.icon_color || 'accent'"
            :size="blok.size || 'large'"
            class="mx-2 text-weight-bold"
            style="font-weight: bold;"
            :append-icon="blok.icon || 'add'"
          >
            {{blok.button_title}}
          </v-btn-primary>
        </template>
        <v-list>
          <v-list-item
            title="Editar botón"
            v-editable="blok"
          ></v-list-item>
          <v-list-item
            :to="!final_url.is_external ? final_url.main_url : undefined"
            :href="final_url.is_external ? final_url.main_url : undefined"
            :target="final_url.is_external ? '_blank' : undefined"
          >
            <v-icon left>open_in_new</v-icon>
            Ir al enlace
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn-primary
        v-else
        :to="!final_url.is_external ? final_url.main_url : undefined"
        :href="final_url.is_external ? final_url.main_url : undefined"
        :target="final_url.is_external ? '_blank' : undefined"
        :variant="variant"
        :color="blok.icon_color || 'accent'"
        :size="blok.size || 'large'"
        class="mx-2 text-weight-bold"
        style="font-weight: bold;"
        :append-icon="blok.icon || 'add'"
      >
        {{blok.button_title}}
      </v-btn-primary>
    </template>
  </client-only>
<!--  <v-btn-->
<!--    -->
<!--    :variant="variant"-->
<!--    :color="blok.color || 'black'"-->
<!--    -->
<!--    -->
<!--    -->
<!--    _click="openDialog"-->
<!--    -->
<!--    rounded="xl"-->
<!--  >-->
<!--    {{blok.button_title}}-->
<!--  </v-btn>-->

</template>

<style scoped lang="scss">

</style>
