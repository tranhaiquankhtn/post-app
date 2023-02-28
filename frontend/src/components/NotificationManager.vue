<template>
  <div>
    <v-snackbar :color="currentNotification?.color" v-model="show">
      <v-progress-circular class="ma-2" indeterminate v-show="showProgress" />
      {{ currentNotification?.msg || 'message' }}
      <v-btn
        @click.native="close"
        icon="mdi-close-circle"
        size="small"
        variant="flat"
        :color="currentNotification?.color"
      />
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref, watch } from 'vue'
import { AppNotification } from '@/store/main/state'

import { store } from '@/store'
import { readFirstNotification } from '@/store/main/getters'
import {
  dispatchRemoveLogin,
  dispatchRemoveNotification,
} from '@/store/main/actions'
import { commitRemoveNotification } from '@/store/main/mutations'

export default defineComponent({
  name: 'NotificationManager',
  setup() {
    const show = ref(false)
    const showProgress = ref(false)
    const currentNotification: Ref<AppNotification | boolean> = ref(false)
    const firstNotification: Ref<AppNotification | boolean> = ref(false)
    watch(
      firstNotification,
      async (
        newNoti: AppNotification | false,
        oldNoti: AppNotification | false,
      ) => {
        console.log('new_noti: ', newNoti)
        if (newNoti !== currentNotification) {
          // await this.setNotification(newNoti)
          if (newNoti) {
            dispatchRemoveNotification(store, {
              notification: newNoti,
              timeout: 6500,
            })
          }
        }
      }, { immediate: true, deep: true }
    )
    return {
      show,
      showProgress,
      currentNotification,
    }
  },
  methods: {
    async setNotification(notification: AppNotification | false) {
      if (this.show) {
        this.hide()
      }
      if (notification) {
        this.currentNotification = notification
        this.showProgress = notification?.showProgress
        this.show = true
      } else {
        this.currentNotification = false
      }
    },
    async close() {
      await this.hide()
      await this.removeCurrentNotification()
    },
    async hide() {
      this.show = false
      await new Promise((resolve, reject) => setTimeout(resolve, 500))
    },
    async removeCurrentNotification() {
      if (this.currentNotification) {
        await commitRemoveNotification(store, this.currentNotification)
      }
    },
  },
  mounted() {
    console.log('NotificationManager mounted')
  },
  created() {
    this.firstNotification = readFirstNotification(this.$store)
    console.log('first_noti:', this.firstNotification)
  },
})
</script>
