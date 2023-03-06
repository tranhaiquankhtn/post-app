<template>
  <v-dialog v-model="show" persistent :width="options.width">
    <v-card>
      <v-toolbar :color="options.color" density="compact">
        <v-card-title>{{ title }}</v-card-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <div>{{ message }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" density="compact" @click="cancel">Cancel</v-btn>
        <v-btn variant="flat" color="info" density="compact" @click="ok">OK</v-btn>
      </v-card-actions>
    </v-card></v-dialog
  >
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { IDialogOption } from '@/types/commons'

const show = ref(false)
const title = ref('')
const message = ref('')

let isConfirmed: any = null
let isCanceled: any = null
const options: IDialogOption = reactive({ width: 400, color: 'info' })
const open = (t: string, m: string, o: IDialogOption) => {
  title.value = t
  message.value = m
  options.value = { ...o }
  show.value = true
  return new Promise((resolve, reject) => {
    isConfirmed = resolve
    isCanceled = reject
  })
}
const ok = () => {
  show.value = false
  isConfirmed(true)
}
const cancel = () => {
  show.value = false
  isConfirmed(false)
}

defineExpose({ open })
</script>
