<script setup>
import MainNav from "~/components/web/MainNav.vue";
import Footer from "~/components/web/Footer.vue";
import MainMenu from "~/components/web/MainMenu.vue";

const { $preview } = useNuxtApp()
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    'global',
    { version: version },
{ customParent: 'https://app.storyblok.com' }
)
definePageMeta({
  layout: 'global',
})


const menu_drawer = ref(false);

function changeMenu() {
  menu_drawer.value = !menu_drawer.value;
}

</script>

<template>
<!--  <v-layout align-center justify-center>-->
    <MainNav
      v-for="blok in story.content.header"
      :key="blok._uid"
      :blok="blok"
      is_editable
      @toggleMenu="changeMenu"
    />
    <MainMenu
      v-for="blok in story.content.header"
      :menu_drawer="menu_drawer"
      :blok="blok"
    />
    <v-main class="mt-4">
      <v-container pa-0 fluid>
        <v-layout align-center justify-center >
        EDITA AQUÍ EL CONTENIDO DEL HEADER, DEL FOOTER Y DEL MENÚ PRINCIPAL
        </v-layout>
      </v-container>
    </v-main>
    <Footer
      v-for="blok in story.content.footer"
      :key="blok._uid"
      :blok="blok"
      is_editable
    />
<!--  </v-layout>-->
</template>

<style scoped lang="scss">

</style>