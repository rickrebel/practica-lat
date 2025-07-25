<script setup>

import StatusDetail from "~/components/dashboard/status/StatusDetail.vue";
import Comments from "~/components/dashboard/common/Comments.vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "~/store/index.js";
import {saveElement, deleteElement} from "~/composables/save_elements.js";
import EditCommonFields from "~/components/dashboard/common/EditCommonFields.vue";
const mainStore = useMainStore()
const { schemas } = storeToRefs(mainStore)

const props = defineProps({
  full_main: Object,
  collection_data: Object,
  collection_name: String,
  can_delete: Boolean,
})

const saving = ref(false)
const snackbar = ref(false)
const editForm = ref(null)
// const emits = defineEmits(['new-item'])
const emits = defineEmits(['new-item', 'item-deleted', 'item-saved'])

const dialog_delete = ref(false)
const deleting = ref(false)
const errors = ref(null)

const final_collection_data = computed(() => {
  if (props.collection_data)
    return props.collection_data
  return schemas.value.collections_dict[props.collection_name]
})

async function saveRecord() {
  errors.value = null
  const { valid } = await editForm.value.validate()
  // emits('save-item', props.full_main)
  if (!valid) return
  saving.value = true
  const elem_id = props.full_main.id ? 'id' : 'key_name'
  // console.log('props.full_main', props.full_main)
  const is_new = !Boolean(props.full_main[elem_id])
  saveElement(final_collection_data.value, props.full_main).then((res) => {
    if (res.errors) {
      errors.value = res.errors
      saving.value = false
      return
    }
    emits('item-saved', {res, is_new})
    snackbar.value = true
    saving.value = false
  })
}

function deleteRecord() {
  errors.value = null
  deleting.value = true
  const id_to_delete = props.full_main[props.collection_data.pk]
  deleteElement(final_collection_data.value, id_to_delete)
    .then((res) => {
      console.log("res", res)
      if (res.errors) {
        // const error_msg = "No se pudo eliminar el registro si tiene datos relacionados"
        // errors.value = `${error_msg}: \n${
        //   JSON.stringify(res.errors.report_data)}`
        let error_msg = "No se pudo eliminar el registro:\n"
        error_msg += JSON.stringify(res.errors)
        errors.value = error_msg
        deleting.value = false
        dialog_delete.value = false
        return
      }
      deleting.value = false
      dialog_delete.value = false
      emits('item-deleted', id_to_delete)
    })
}

</script>

<template>
  <v-card class="mb-3 pa-3" elevation="8">
    <v-alert
      v-if="errors"
      type="error"
      dismissible
      border="left"
      elevation="2"
      class="mb-3"
    >
      {{ errors }}
    </v-alert>
    <v-form
      ref="editForm"
    >
      <EditCommonFields
        :full_main="full_main"
        :final_collection_data="final_collection_data"
      >
        <template #edit="{ full_main }">
          <slot name="edit" :full_main="full_main">
            EDICIÓN 1 (REPORTAR ESTO PORQUE NO ES NORMAL)
          </slot>
        </template>
      </EditCommonFields>
      <v-card-actions>
        <v-btn
          v-if="final_collection_data.level !== 'secondary'"
          color="error"
          variant="outlined"
          @click="dialog_delete = true"
        >
          Eliminar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="accent"
          :id="`save_${final_collection_data.snake_name}-${
            full_main.id || full_main.key_name || 'new'
          }`"
          variant="elevated"
          :loading="saving"
          @click="saveRecord"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-form>
    <v-snackbar
      v-model="snackbar"
      color="success"
      location="right top"
      location-strategy="connected"
    >
      Se ha guardado el registro
      <template v-slot:actions>
        <v-btn
          color="accent"
          variant="text"
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
      v-model="dialog_delete"
      max-width="500"
    >
      <v-card class="pa-3">
        <v-card-title>
          ¿Confirmas la eliminación de este registro?
        </v-card-title>
        <v-card-subtitle>
          Esta acción no se puede deshacer
        </v-card-subtitle>
        <v-card-actions class="py-4">
          <v-btn
            color="accent"
            variant="outlined"
            @click="dialog_delete = false"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="can_delete"
            color="error"
            variant="elevated"
            :loading="deleting"
            @click="deleteRecord"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>

</style>