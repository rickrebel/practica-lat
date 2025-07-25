<script setup>

import { useGoTo } from 'vuetify'
import { useWebStore } from '~/store/web.js'
const webStore = useWebStore()
const { sendResponse, saveFile } = webStore

const props = defineProps({
  blok: Object,
  is_dialog: Boolean,
})

const form_data = ref({
  id: null,
  first_name: '',
  last_name: '',
  state: '',
  appointment_obj: null,
  appointment: null,
  source_type: null,
  source_type_obj: null,
  source_link: '',
  message: '',
  files: [],
  email: '',
  phone: '',
  key: '',
  valid_filled: false,
})

const appointment = [
  {
    text: 'Persona juzgadora de Distrito',
    value: 'distrito',
    need_state: true
  },
  {
    text: 'Magistratura de Circuito',
    value: 'circuito',
    need_state: true
  },

  {
    text: 'Ministra o Ministro de la SCJN',
    value: 'scjn'
  },
  {
    text: 'Magistratura de Sala Superior del TEPJF',
    value: 'tepjf_superior'
  },
  {
    text: 'Magistratura de Sala Regional del TEPJF',
    value: 'tepjf_regional',
    need_state: true
  },
  {
    text: 'Tribunal de Disciplina Judicial',
    value: 'tdj'
  },
  {
    text: 'No lo tengo claro',
    value: 'unknown',
    need_state: false
  },
]
const states = [
  "Nacional",
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Coahuila",
  "Colima",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Durango",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "México",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
  "No aplica o no lo sé",
]

const source_types = [
  {"name": "Nota periodística", "value": "news", "need_link": true},
  {"name": "Información pública", "value": "public", "need_link": false},
  {"name": "Redes sociales", "value": "social", "need_link": true},
  {"name": "Otra fuente", "value": "other", "need_link": false},
]

const gossipForm = ref(null)
const gossip_form = ref(false)
const has_error = ref(false)
const ready_files = ref(0)
const all_saved = ref(false)
const saving = ref(false)

const rules = {
  required: value => !!value || 'Campo requerido',
}

const emits = defineEmits(['close-dialog'])

async function submitForm(){
  console.log("useGoTo", useGoTo)
  const { valid } = await gossipForm.value.validate()
  if (!valid){
    has_error.value = true
    document.getElementById('gossip').scrollIntoView({behavior: 'smooth'})
    // window.scrollTo(0, 0)
    return
  }
  saving.value = true
  form_data.value.valid_filled = true
  form_data.value.appointment = form_data.value.appointment_obj.text
  form_data.value.source_type = form_data.value.source_type_obj.name
  sendResponse(form_data.value).then(res=>{
    form_data.value.id = res.id
    if (form_data.value.files.length > 0)
      sendFiles()
    else{
      all_saved.value = true
      saving.value = false
    }
  })
}

function sendFiles(){
  // form_data.value.files.forEach(file_obj => {
  //   let formData = new FormData();
  //   formData.append("file", file_obj.file, file_obj.file.name);
  //   const elem_id = form_data.value.id
  //   saveFile([elem_id, formData]).then(res=>{
  //     console.log("res", res);
  //     ready_files.value += 1
  //     if (ready_files.value === form_data.value.files.length){
  //       all_saved.value = true
  //       saving.value = false
  //     }
  //   })
  // })
}

function uploadFile(e){
  let files = e.target.files || e.dataTransfer.files;
  console.log("files", files)
  let list_files = Array.from(files)
  list_files.forEach(file => {
    console.log("file", file)
    let file_obj = {file: file, url: URL.createObjectURL(file)}
    form_data.value.files.push(file_obj)
  })
}

function addNewPerson(){
  form_data.value = {
    files: [], valid_filled: false, id: null,
    email: form_data.value.email, phone: form_data.value.phone
  }
  gossip_form.value = false
  all_saved.value = false
  ready_files.value = 0
  has_error.value = false
}

function finish() {
  if (props.is_dialog)
    emits('close-dialog')
  else{
    const router = useRouter()
    router.push('/')
  }

}

</script>

<template>
  <v-row v-if="all_saved">
    <v-col cols="12">
      <v-alert
        type="success"
        variant="elevated"
        class="mx-3 mt-3"
      >
        Tu información ha sido enviada con éxito.
        <b>¡Gracias por compartir la información!</b>
      </v-alert>
    </v-col>
    <v-col cols="12" class="text-center">
      <v-card-title
        class="text-h6 text-center text-primary font-weight-bold pt-3"
        id="gossip"
      >
        ¿Deseas compartir más datos sobre otra persona postulante?
      </v-card-title>
      <v-card-actions class="px-6 pb-6 pt-3">
        <v-spacer></v-spacer>
        <v-btn
          color="accent"
          variant="outlined"
          size="large"
          @click="finish"
        >
          <span v-if="is_dialog">
            Es todo, cerrar formulario
          </span>
          <span v-else>
            Es todo, ir a la página principal
          </span>
        </v-btn>
        <v-btn
          color="accent"
          variant="elevated"
          size="large"
          @click="addNewPerson"
        >
          Sí, agregar otra persona
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-col>
  </v-row>
  <v-form
    v-else
    ref="gossipForm"
    v-model="gossip_form"
    @submit.prevent="submitForm"
  >
    <v-card-title
      v-if="!is_dialog"
      class="text-h5 text-center text-primary font-weight-bold pt-3 mb-3 title-no-wrap"
      id="gossip"
    >
      Reporta a personas juzgadoras candidatas con conflictos de interés
    </v-card-title>
    <v-alert type="info" variant="tonal" class="mx-3">
      Comparte toda la información y/o evidencia que tengas sobre
      situaciones que puedan poner en riesgo la independencia, imparcialidad o
      profesionalismo de las personas que aspiran a un cargo judicial.
    </v-alert>
    <v-alert
      type="error"
      v-if="has_error"
      variant="elevated"
      class="mx-3 mt-3"
    >
      Por favor, revisa los campos marcados en rojo
    </v-alert>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="pb-1 text-subtitle-1">
          <span  class="text-secondary">

            Comencemos con el nombre completo de la persona postulante o candidata
          </span>
          <br>
          <span class="text-grey-darken-1 text-body-2">
            (Llena un formulario por cada persona de la que tengas información)
          </span>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="form_data.first_name"
            label="Nombre(s)*"
            variant="outlined"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7">
          <v-text-field
            v-model="form_data.last_name"
            label="Apellidos*"
            variant="outlined"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="pt-0 py-1 text-subtitle-1 text-secondary">
          ¿A qué cargo postula la persona de la que nos compartes información?
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="form_data.appointment_obj"
            :items="appointment"
            label="Cargo*"
            return-object
            item-value="value"
            item-title="text"
            variant="outlined"
            :rules="[rules.required]"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6" v-if="form_data.appointment_obj?.need_state">
          <v-autocomplete
            v-model="form_data.state"
            :items="states"
            label="Entidad Federativa"
            variant="outlined"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" class="pt-0 py-1 text-subtitle-1 text-secondary">
          Amplía la información que nos compartes
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="form_data.source_type_obj"
            :items="source_types"
            label="Fuente de información*"
            item-value="value"
            item-title="name"
            variant="outlined"
            return-object
            :rules="[rules.required]"
          ></v-select>
        </v-col>
        <v-col cols="12" md="8" v-if="form_data.source_type_obj?.need_link">
          <v-text-field
            v-model="form_data.source_link"
            label="Link web de la fuente"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="form_data.message"
            label="Cuéntanos todos los detalles relevantes"
            variant="outlined"
            rows="4"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-col cols="12" class="pt-0 py-1 text-subtitle-1 text-secondary">
          Agrega los archivos que consideres relevantes (opcional)
        </v-col>
        <v-col cols="12">
          <v-file-input
            label="Adjuntar archivos"
            name="logo"
            variant="solo"
            rounded="lg"
            multiple
            class="normal-field"
            @change="uploadFile($event)"
          ></v-file-input>
        </v-col>
        <v-col cols="12" class="pt-0 py-1 text-subtitle-1 text-secondary">
          <b>Si te interesa entrar en contacto</b>
          déjanos tus datos de contacto para buscarte
          posteriormente para más información (opcional)
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form_data.email"
            label="Correo electrónico"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form_data.phone"
            label="Teléfono"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-6 pb-6">
      <v-btn
        v-if="is_dialog"
        color="accent"
        variant="outlined"
        @click="emits('close-dialog')"
      >
        Cancelar
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="accent"
        variant="elevated"
        size="large"
        type="submit"
        :loading="saving"
      >
        Enviar formulario
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<style scoped lang="scss">
.title-no-wrap{
  white-space: normal !important;
}
</style>