<template>
  <div id="app">
    <v-app>
      <v-main v-if="isLoggedIn === null">
        <v-layout align-center justify-center>
          <div class="text-xs-center">
            <div class="headline">Loading ...</div>
            <v-progress-circular size="100" indetermine color="primary" />
          </div>
        </v-layout>
      </v-main>
      <router-view v-else />
      <notification-manager />
    </v-app>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { store } from '@/store'
import { readIsLoggedIn } from '@/store/main/getters'
import { dispatchCheckLoggedIn } from '@/store/main/actions'

import NotificationManager from '@/components/NotificationManager.vue'
export default defineComponent({
  name: 'App',
  components: {
    NotificationManager,
  },
  setup() {
    return {
      isLoggedIn: readIsLoggedIn(store),
    }
  },
  created() {
    dispatchCheckLoggedIn(this.$store)
  },
})
</script>
