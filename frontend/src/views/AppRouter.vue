<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { appState } from '@/stores/state.ts'

const guardRoute = async (to, from, next) => {
  const store = appState()
  if (store.readLoggedIn) {
    if (to.path === '/login' || to.path === '/') {
      next('/main')
    } else {
      next()
    }
  } else if (store.readLoggedIn === false) {
    if (to.path === '/' || (to.path as string).startsWith('/main')) {
      next('/login')
    } else {
      next()
    }
  }
}
export default defineComponent({
  beforeRouteEnter(to, from, next) {
    guardRoute(to, from, next)
  },
  beforeRouteUpdate(to, from, next) {
    guardRoute(to, from, next)
  },
})
</script>
