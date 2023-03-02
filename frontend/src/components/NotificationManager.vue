<template>
  <div>
    <v-snackbar
      variant="flat"
      :color="currentNotification.color"
      v-model="show"
    >
      <v-progress-circular class="ma-2" indeterminate v-show="showProgress" />
      {{ currentNotification.msg || 'message' }}
      <template v-slot:actions>
        <v-btn
          @click.native="close"
          icon="mdi-close-circle"
          size="small"
          variant="flat"
          :color="currentNotification.color"
        />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, type Ref, watchEffect } from 'vue'
import { AppNotification } from '@/store/main/state'

import { store } from '@/store'
import { readFirstNotification } from '@/store/main/getters'
import {
  dispatchRemoveLogin,
  dispatchRemoveNotification,
} from '@/store/main/actions'
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
  if (currentNotification) {
    await commitRemoveNotification(store, currentNotification)
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
