<template>
  <div>
    <v-navigation-drawer persistent fixed app :mini-variant="miniDrawer">
      <v-list dense nav>
        <v-list-item prepend-avatar="mdi-account" :title="title" />
      </v-list>
      <v-divider />
      <v-list dense nav v-for="(menu, idx) in appMenus" :key="idx" primary>
        <div v-show="menu.header !== 'Admin' || (menu.header === 'Admin' && hasAdminAccess)">
          <v-list-subheader>{{ menu.header }}</v-list-subheader>
          <v-list-item v-for="item in menu.children" :key="item.title" :to="item.link">
            <template v-slot:prepend>
              <v-icon :icon="item.icon" />
            </template>
            <v-list-item-title v-text="item.title" />
          </v-list-item>
        </div>
        <v-divider />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>

    <v-footer class="pa-3" color="primary" app fixed>
      <v-spacer></v-spacer>
      <span class="white--text">&copy; {{ title }}</span>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { menus } from '@/menus'
import { appName } from '@/env'
import { appState } from '@/stores/state'

export default defineComponent({
  name: 'Main',
  setup() {
    const store = appState()
    const appMenus = menus
    const title = appName
    return {
      title,
      appMenus,
      store,
    }
  },
  methods: {
    hasAdminAccess() {
      return store.readAdminAccess
    },
    showDrawer() {
      return store.readShowDraer
    },
    miniDrawer() {
      return store.readMiniDrawer
    },
  },
})
</script>
