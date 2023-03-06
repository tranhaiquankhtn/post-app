<template>
  <div>
    <v-snackbar
      v-model="show"
      variant="flat"
      :color="(currentNotification as AppNotification).color"
    >
      <v-progress-circular v-show="showProgress" class="ma-2" indeterminate />
      {{ (currentNotification as AppNotification).msg || 'message' }}
      <template #actions>
        <v-btn
          icon="mdi-close-circle"
          size="small"
          variant="flat"
          :color="(currentNotification as AppNotification).color"
          @click="close"
        />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watchEffect } from 'vue'
import { AppNotification } from '@/store/main/state'

import { store } from '@/store'
import { readFirstNotification } from '@/store/main/getters'
import { dispatchRemoveNotification } from '@/store/main/actions'
import { commitRemoveNotification } from '@/store/main/mutations'

const show: Ref<boolean> = ref(false)
const showProgress: Ref<boolean> = ref(false)
const currentNotification: Ref<AppNotification | boolean> = ref(false)

const close = async () => {
  await hide()
  await removeCurrentNotification()
}

const hide = async () => {
  show.value = false
  await new Promise((resolve, reject) => setTimeout(resolve, 500))
}

const removeCurrentNotification = async () => {
  if (currentNotification.value) {
    commitRemoveNotification(store, currentNotification)
  }
}

const setNotification = async (notification: AppNotification | false) => {
  if (show.value) {
    await hide()
  }
  if (notification) {
    currentNotification.value = notification
    showProgress.value = notification?.showProgress
    show.value = true
  } else {
    currentNotification.value = false
  }
}
watchEffect(async () => {
  const newNoti = readFirstNotification(store)
  if (newNoti !== currentNotification.value) {
    await setNotification(newNoti)
    if (newNoti) {
      dispatchRemoveNotification(store, {
        notification: newNoti,
        timeout: 2000,
      })
    }
  }
})
</script>
