<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { store } from '@/store'
import { readLoggedIn } from '@/store/main/getters'
import { dispatchCheckLoggedIn } from '@/store/main/actions'

const guardRoute = async (to, from, next) => {
  await dispatchCheckLoggedIn(store)
  const isLoggedIn = readLoggedIn(store)
  if (isLoggedIn) {
    if (to.path === '/login' || to.path === '/') {
      next('/main')
    } else {
      next()
    }
  } else if (isLoggedIn === false) {
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
  beforeRouteUpdate(store, to, from, next) {
    guardRoute(to, from, next)
  },
})
</script>
