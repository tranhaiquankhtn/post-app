<template>
  <div class="text-center">
    <v-overlay class="align-center justify-center" :model-value="isLoading">
      <v-progress-circular
        color="info"
        indeterminate
        size="32"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>
