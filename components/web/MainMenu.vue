<script setup>

const props = defineProps({
  // main_collections: {
  //   type: Array,
  //   required: true,
  // },
  menu_drawer: {
    type: Boolean,
    required: true,
  },
})

const final_buttons = computed(() => {
  return []
})

// const menu_drawer = ref(false)

</script>

<template>
  <v-navigation-drawer
    :model-value="menu_drawer"
    app
    temporary
    location="right"
    _floating
    mobile-breakpoint="960"
    tile
    width="280"
  >
    <v-list nav open-strategy="multiple" _active-class="text-primary">
      <v-list-item>
        <template v-slot:prepend v-if="false">
          <v-icon>dashboard</v-icon>
        </template>
        <v-list-item-title class="text-h6">
          Menú
        </v-list-item-title>
        <v-list-item-subtitle>
          (en desarrollo)
        </v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>
      <client-only>
        <template
          v-for="collection in final_buttons"
        >
<!--          <v-list-group-->
<!--            v-if="collection.catalog_groups.length"-->
<!--            :key="collection.snake_name"-->
<!--            :value="collection.snake_name"-->
<!--            soubgroup-->
<!--          >-->
<!--            <template v-slot:activator="{ props, isOpen }">-->
<!--              <v-list-item-->
<!--                v-bind="props"-->
<!--                exact-->
<!--                :title="collection.plural_name"-->
<!--                :prepend-icon="collection.icon || 'category'"-->
<!--                :base-color="collection.color || 'grey-darken-1'"-->
<!--                @click="openItem($event, collection.snake_name)"-->
<!--                :class="collection.level === 'primary' ? '' : '_ml-3'"-->
<!--                :active-class="collection.level === 'primary'-->
<!--                  ? '' : 'font-weight-bold'"-->
<!--                _disabled="!is_full_editor &&-->
<!--                    !['location', 'note'].includes(collection.snake_name)"-->
<!--              >-->
<!--                <template v-slot:append="{ isActive, select }">-->
<!--                  <v-icon-->
<!--                    @click="openIcon"-->
<!--                  >-->
<!--                    {{ isActive ? 'expand_less' : 'expand_more' }}-->
<!--                  </v-icon>-->
<!--                </template>-->
<!--              </v-list-item>-->
<!--            </template>-->
<!--            <v-list-item-->
<!--              v-for="(sub_coll, i) in collection.catalog_groups"-->
<!--              :key="i"-->
<!--              exact-->
<!--              :title="sub_coll.name"-->
<!--              :value="sub_coll.snake_name"-->
<!--              _to="`/dashboard/catalog/${sub_item.key}`"-->
<!--              :to="`/dashboard/catalog/${sub_coll.key_name}`"-->
<!--            ></v-list-item>-->
<!--          </v-list-group>-->
<!--          <v-list-item-->
<!--            v-else-->
<!--            :key="collection.snake_name"-->
<!--            :value="collection.snake_name"-->
<!--            exact-->
<!--            _active-class="text-accent"-->
<!--            :to="`/dashboard/${collection.snake_name}`"-->
<!--            :prepend-icon="collection.icon"-->
<!--            :disabled="!is_full_editor"-->
<!--            :title="collection.plural_name"-->
<!--          ></v-list-item>-->
<!--          <v-divider></v-divider>-->
        </template>
      </client-only>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">

</style>