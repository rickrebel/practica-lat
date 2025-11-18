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
    class="py-2 py-sm-6 footer-shadow"
    style="width: 100%;"
  >
    <v-row
      v-if="main_blok"
      class="app-width2"
    >
      <v-col
        cols="12"
        sm="8"
        order="1"
        md="4"
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
      </v-col>

      <v-col
        cols="12"
        md="5"
        lg="6"
        order="3"
        order-md="2"
        class="text-left pa-3"
        align-self="center"
      >
        <v-row
          v-if="final_buttons.length"
          class="d-flex justify-space-between flex-wrap"
          no-gutters
        >
          <v-col
            cols="6"
            sm="4"
            md="6"
            lg="4"
            v-for="blok in final_buttons"
            :key="blok._uid"
          >

            <StoryblokComponent
              :blok="blok"
            ></StoryblokComponent>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        sm="4"
        md="3"
        lg="2"
        order="2"
        order-md="3"
        class="pa-3"
        align-self="center"
      >
        <div class="d-flex justify-center">
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
              v-if="net.logo?.filename"
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
        <v-img
          v-if="main_blok.seal && main_blok.seal.filename"
          :src="resizeImg(main_blok.seal, 300)"
          class="mx-3 mt-6 mx-auto"
          max-width="260"
        />
      </v-col>
    </v-row>
  </v-footer>
</template>

<style scoped lang="scss">
.footer-shadow{
  // shadow above of the footer
  box-shadow:
    0px -2px 4px -1px rgba(255, 255, 255, 0.4),
    0px -4px 5px 0px rgba(255, 255, 255, 0.2),
    0px -1px 10px 0px rgba(255, 255, 255, 0.15);


}
</style>