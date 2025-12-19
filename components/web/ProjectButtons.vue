<script setup>

import {resizeImg} from "~/composables/storyblok_images";
import {currentLocale} from "~/composables/locales";

const props = defineProps({
  project_content: Object,
  axis_full: Object,
})

const social_dict = {
  facebook: 'social/facebook_blanco.png',
  twitter: 'social/twitter_blanco.png',
  instagram: 'social/instagram_blanco.png',
  threads: 'social/threads_blanco.png',
  tiktok: 'social/tiktok_blanco.png',
  youtube: 'social/youtube_blanco.png',
}

const social_networks = computed(() => {
  if (!props.project_content.social_networks)
    return []
  return props.project_content.social_networks.map(net => {
    if (!net.logo?.filename && net.social_network) {
      const icon = social_dict[net.social_network.toLowerCase()]
      if (icon)
        net.simple_logo = `/${icon}`
    }
    return net
  })
})

</script>

<template>
  <v-card-actions
    class="d-flex flex-wrap"
  >
    <v-btn-primary
      v-if="project_content.website"
      variant="flat"
      color="white"
      :href="project_content.website"
      target="_blank"
      prepend-icon="language"
      class="font-weight-medium mr-4"
    >
      {{ project_content.website }}
    </v-btn-primary>
    <v-btn
      v-for="net in social_networks"
      :key="net._uid"
      align="end"
      class="mr-4 text-primary"
      icon
      variant="text"
      :href="net.url"
      target="_blank"
      color="white"
      size="small"
    >
      <v-avatar
        v-if="net.simple_logo"
        size="default"
      >
        <img
          :src="net.simple_logo"
          :alt="net.icon"
          :height="24"
        >
      </v-avatar>
      <v-avatar
        v-else-if="net.logo?.filename"
        size="default"
      >
        <img
          :src="resizeImg(net.logo, 80)"
          :alt="net.logo"
          :height="24"
        >
      </v-avatar>
      <v-icon v-else size="large" color="white">
        user
      </v-icon>

      <v-tooltip
        location="top"
        activator="parent"
        :text="net.social_network || 'Red social'"
      ></v-tooltip>
    </v-btn>
    <v-spacer></v-spacer>
    <slot name="complementary_buttons"></slot>

  </v-card-actions>
</template>

<style scoped lang="scss">

</style>