<template>
  <v-app>
    <!-- Drawer -->
    <v-navigation-drawer
      v-model="showDrawer"
      persistent
      fixed
      app
      :mini-variant="miniDrawer"
    >
      <v-list dense nav>
        <v-list-item
          prepend-avatar="https://thaiquan.dev/img/avatar.jpg#avatar"
        >
          <v-list-item-title>{{ title.toUpperCase() }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list v-for="(menu, idx) in appMenus" :key="idx" info dense nav>
        <div
          v-show="
            menu.header !== 'Admin' || (menu.header === 'Admin' && isAdmin)
          "
        >
          <v-list-subheader>{{ menu.header }}</v-list-subheader>
          <v-list-item
            v-for="item in menu.children"
            :key="item.title"
            :to="item.link"
          >
            <template #prepend>
              <v-icon :icon="item.icon" />
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-divider />
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- App-bar -->
    <v-app-bar color="info" app floating>
      <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer" />
      <v-spacer />
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item to="/main/profile" prepend-icon="mdi-account">
            <v-list-subheader> Profile </v-list-subheader>
          </v-list-item>
          <v-list-item prepend-icon="mdi-logout" @click="logout()">
            <v-list-subheader> Logout </v-list-subheader>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{
          theme.global.current.value.dark
            ? 'mdi-brightness-6'
            : 'mdi-brightness-4'
        }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Routing -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <v-footer class="pa-3" color="info" app fixed>
      <v-spacer />
      <span class="white--text">&copy; {{ title }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useTheme } from 'vuetify'
import { menus } from '@/menus'
import { appName } from '@/env'

import { store } from '@/store'
import { dispatchLogOut } from '@/store/main/actions'
import {
  readMiniDrawer,
  readShowDrawer,
  readHasAdminAccess,
} from '@/store/main/getters'

export default defineComponent({
  beforeRouteEnter(to: any, _: any, next: any) {
    if (to.path === '/main') {
      next('/main/dashboard')
    } else {
      next()
    }
  },
  setup() {
    const theme = useTheme()
    const isAdmin = readHasAdminAccess(store)
    return {
      title: appName,
      appMenus: menus,
      miniDrawer: ref(readMiniDrawer(store)),
      showDrawer: ref(readShowDrawer(store)),
      isAdmin,
      theme,
      toggleTheme: () =>
        (theme.global.name.value = theme.global.current.value.dark
          ? 'light'
          : 'dark'),
    }
  },
  methods: {
    logout() {
      dispatchLogOut(this.$store)
    },
  },
})
</script>
<style lang="scss" scoped>
.v-text-field {
  font-size: 1em;
}
</style>
