<script setup>
// import {computed, ref} from "vue";

const props = defineProps({
  blok: Object,
})

const justify = ref(props.blok.justify || false)

const explanation = computed(() => {
  let rich_text = renderRichText(props.blok.text)
  if (!rich_text)
    return '-'
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse">')
  return rich_text
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
            color="secondary"
            class="px-5 py-1 text-white font-weight-bold text-h5"
          >
            <div class="oswald">
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
          :class="{'text-justify' : justify}"
          _class="{'text-justify' : blok.justify}"
        ></div>
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
