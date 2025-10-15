<script setup>
import { computed, ref, onMounted } from 'vue'
// import { useMainStore } from '~/store/index'
import { useWebStore } from '~/store/web.ts'
import { storeToRefs } from 'pinia'

const webStore = useWebStore()
const { global_config } = storeToRefs(webStore)
const props = defineProps({
  blok: Object,
})

const is_mounted = ref(false)

onMounted(() => {
  // console.log('global_config 1', global_config.value)
  is_mounted.value = true
})

const main_blok = computed(() => {
  if (props.blok) return props.blok
  // console.log('global_config 2', global_config.value)
  const global_c = global_config.value
  if (global_c && global_c.footer && global_c.footer.length > 0)
    return global_c.footer[0]
})

const description = computed(() => {
  return renderRichText(main_blok.value.description)
})

const final_buttons = computed(() => {
  if (!main_blok.value) return []
  // console.log("main_blok.buttons", main_blok.value.buttons)
  return main_blok.value.buttons || []
})

function wantOpenLink(url) {
  if (!url) return
  if (!url.url) return
  window.open(url.url, '_blank')
}

</script>

<template>
  <v-footer
    v-if="is_mounted"
    padless
    id="app"
    v-editable="blok"
    color="black"
    class="py-2"
    style="width: 100%;"
  >
    <v-row
      v-if="main_blok"
      class="app-width2"
    >
      <v-col
        cols="12"
        sm="4"
        class="text-left pa-3 text-justify d-flex flex-column align-start"
      >
        <v-img
          src="~/assets/logo_simple_white.png"
          width="240"
          class="mb-4"
        />

        <div
          v-if="description"
          v-html="description"
          class="text-body-2 text-sm-body-1 py-2 lato"
        ></div>
<!--        <v-divider-->
<!--          v-if="main_blok.contact_email || main_blok.social_networks.length > 0"-->
<!--          color="white" class="my-1"-->
<!--        ></v-divider>-->
<!--        <div v-if="main_blok.contact_email" class="lato">-->
<!--          <b>Contacto:</b> {{ main_blok.contact_email }}-->
<!--        </div>-->


      </v-col>

      <v-col
        cols="8"
        sm="5"
        offset="2"
        offset-sm="0"
        class="text-left pa-3"
      >
        <div v-if="final_buttons.length">

          <StoryblokComponent
            v-for="blok in final_buttons"
            :key="blok._uid"
            :blok="blok"
            fixed_size="default"
            fixed_variant="text"
            fixed_color="white"
          ></StoryblokComponent>
        </div>
      </v-col>
      <v-col
        cols="8"
        sm="3"
        offset="2"
        offset-sm="0"
        class="text-left pa-3"
      >
        <div class="_mt-4">
          <v-btn
            v-for="net in main_blok.social_networks"
            :key="net._uid"
            align="end"
            class="mr-4 text-primary"
            icon
            variant="tonal"
            @click="wantOpenLink(net.url)"
            color="white"
          >
            <v-avatar
              v-if="net.logo"
              size="default"
            >
              <img
                :src="resizeImg(net.logo, 80)"
                :alt="net.icon"
                :height="24"
              >
            </v-avatar>
            <v-icon v-else size="large" color="white">
              user
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style scoped lang="scss">

</style>