<script setup>

import {useMainStore} from '~/store/index.js'
import EditCommon from "~/components/dashboard/common/EditCommon.vue";
import WordListEdit from "~/components/dashboard/search/word_list/WordListEdit.vue";
import {onMounted} from "vue";
const mainStore = useMainStore()
const { cats, schemas } = storeToRefs(mainStore)

const props = defineProps({
  is_massive_edit: Boolean,
  is_edit: Boolean,
  full_main: {
    type: Object,
    required: true,
  },
})

const words = ["main_words", "complementary_words", "negative_words"]

const dialog_edit = ref(false)
const element_to_edit = ref(null)
const cluster_in_edit = ref(null)
// const new_apply_query = ref(null)
const edit_type = ref(null)

const collection_data_word_list = computed(() => {
  return schemas.value.collections_dict['word_list']
})

const main_word_lists = computed(() => {
  return cats.value.cluster.map(cluster => {
    const word_lists = cats.value.word_list.filter(
        word_list => word_list.cluster === cluster.id)
    return {...cluster, word_lists: word_lists}
  })
})

const total_words = computed(() => {
  const patterns = [/ AND /g, / OR /g];
  const text = props.full_main.query || '';
  return patterns.reduce((acc, pattern) => {
    return acc + (text.match(pattern) || []).length;
  }, 1);
})

const counter_color = computed(() => {
  if (total_words.value > 13)
    return 'error'
  else if (total_words.value > 10)
    return 'warning'
  else
    return 'success'
})



function editWordList(word_list) {
  element_to_edit.value = word_list
  edit_type.value = {key: 'edit', title: 'Editar lista de palabras'}
  dialog_edit.value = true
}

function addWordList(cluster) {
  element_to_edit.value = {
    cluster: cluster.id,
  }
  cluster_in_edit.value = cluster
  edit_type.value = {key: 'add', title: 'Nueva lista de palabras'}
  dialog_edit.value = true
  // console.log("addWordList", cluster)
}

function saveNewElement({res, is_new}) {
  // console.log("saveNewElement", res, is_new)
  // const word_index = words.indexOf(cluster_in_edit.value.name)
  // props.full_main[cluster_in_edit.value.name
  if (is_new){
    const cluster_word = words[cluster_in_edit.value.order - 1]
    if (!props.full_main[cluster_word])
      props.full_main[cluster_word] = []
    // console.log("full_main", props.full_main)
    // console.log("cluster_in_edit", cluster_in_edit.value)
    props.full_main[cluster_word].push(res.id)
    saveSearchQuery()
  }
  dialog_edit.value = false
  element_to_edit.value = null
  cluster_in_edit.value = null
}

function saveSearchQuery() {
  if (!props.full_main.id)
    return
  const save_id = `save_search_query-${props.full_main.id}`
  document.getElementById(save_id).click()
  // const word_index = words.indexOf(value.name)
  // props.full_main[value.name] = value.value
}


</script>

<template>
  <v-col
    v-for="(cluster, index) in main_word_lists"
    cols="12"
    class="pa-0 align-center"
  >
    <span class="text-h6 mr-2 text-primary">
      {{cluster.name}}
      <v-chip
        color="info"
        v-tooltip="cluster.description || 'Ayuda no definida'"
        append-icon="help"
      >
        Ayuda
      </v-chip>

    </span>

    <v-chip-group
      v-model="full_main[words[index]]"
      column
      multiple
      selected-class="font-weight-bold text-accent"
      @update:model-value="saveSearchQuery"
    >
      <div
        v-for="word_list in cluster.word_lists"
        :key="word_list.id"
      >
        <v-chip
          :value="word_list.id"
          filter
          class="mr-0 ml-2"
        >
          <template v-slot:close v-if="word_list.query_words">
            <v-icon
              v-tooltip="word_list.query_words"
              variant="outlined"
              @click="editWordList(word_list)"
            >
              subject
            </v-icon>
          </template>
          {{word_list.name}}
        </v-chip>
        <v-btn
          icon
          @click="editWordList(word_list)"
          size="small"
          class="ml-n2"
          variant="text"
        >
          <v-icon>edit</v-icon>
        </v-btn>
      </div>
      <v-btn
        @click="addWordList(cluster)"
        class="align-self-center ml-2"
        color="accent"
        variant="outlined"
        prepend-icon="add"
      >
        Crear nuevo
      </v-btn>
    </v-chip-group>
  </v-col>
  <template v-if="full_main.id">
    <v-col cols="12" class="d-flex pa-0 mt-6">
      <v-sheet
        color="grey-lighten-4"
        class="pa-2"
        rounded="lg"
        style="width: 100%;"
      >
        <div class="text-lime-darken-3 text-subtitle-1">
          Consulta
          <span
            class="font-weight-bold"
            :class="`text-${counter_color}`"
          >
            ({{total_words}}/13 palabras)
          </span>
          <v-icon
            v-if="total_words > 13"
            color="error"
            class="ml-2"
            v-tooltip="'Demasiadas palabras, máximo 13'"
          >
            warning
          </v-icon>
        </div>
        <span class="text-body-1">
          {{full_main.query}}
        </span>
      </v-sheet>
    </v-col>
    <v-col cols="12" class="d-flex pa-0 mt-2">
      <v-sheet
        color="grey-lighten-4"
        class="pa-2"
        rounded="lg"
        style="width: 100%;"
      >
        <div class="text-lime-darken-3 text-subtitle-1">
          Palabras para excluir después de la consulta
        </div>
        <span class="text-body-1">
          {{full_main.query_words_soft}}
        </span>
      </v-sheet>
    </v-col>
    <v-col cols="12" class="pa-0 my-3">
      <v-card variant="outlined" class="pa-3 d-flex" color="secondary">

        <v-switch
          v-model="full_main.use_manual_query"
          label="Usar consulta manual (en lugar de la automática)"
          class="mr-2"
          color="accent"
        />
        <v-textarea
          v-model="full_main.manual_query"
          label="Consulta (manual)"
          class="mr-2"
          color="black"
          bg-color="white"
          rows="2"
          auto-grow
          variant="outlined"
          hide-details
        />
      </v-card>
    </v-col>

  </template>
  <v-dialog
    v-model="dialog_edit"
    max-width="980"
  >
    <v-card v-if="element_to_edit">
      <v-card-title>
        {{edit_type.title}}
      </v-card-title>
      <EditCommon
        :full_main="element_to_edit"
        :collection_data="collection_data_word_list"
        @item-saved="saveNewElement"
      >
        <template v-slot:edit="{ full_main }">
          <WordListEdit
            :full_main="element_to_edit"
          />
        </template>
      </EditCommon>
    </v-card>
  </v-dialog>
</template>

<style scoped>
img {
  display: none !important;
}
.turn180 {
  transform: rotate(180deg);
}
</style>