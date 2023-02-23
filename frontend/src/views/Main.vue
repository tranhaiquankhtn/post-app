<template>
  <div>
    <!-- Drawer -->
    <v-navigation-drawer persistent fixed app :mini-variant="miniDrawer" v-model="showDrawer">
      <v-list dense nav>
        <v-list-item prepend-avatar="https://thaiquan.dev/img/avatar.jpg#avatar">
          <v-list-item-title v-text="title.toUpperCase()" />
        </v-list-item>
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

    <!-- App-bar -->
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer" />
      <v-spacer />
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item to="/main/profile" prepend-icon="mdi-account">
            <v-list-subheader> Profile </v-list-subheader>
          </v-list-item>
          <v-list-item @click="logout" prepend-icon="mdi-logout">
            <v-list-subheader> Logout </v-list-subheader>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Routing -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <v-footer class="pa-3" color="primary" app fixed>
      <v-spacer></v-spacer>
      <span class="white--text">&copy; {{ title }}</span>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapWritableState } from 'pinia'
import { menus } from '@/menus'
import { appName } from '@/env'
import { appState } from '@/stores'

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
  computed: {
    ...mapState(appState, {
      miniDrawer: 'miniDrawer',
    }),
    ...mapWritableState(appState, {
      showDrawer: 'showDrawer',
    }),
  },
  methods: {
    hasAdminAccess() {
      return store.hasAdminAccess
    },
  },
  beforeRouteEnter(to: any, from: any, next: any) {
    if (to.path === '/main') {
      next('/main/dashboard')
    } else {
      next()
    }
  },
  mounted() {
    console.log('Main mounted')
  },
})
</script>
