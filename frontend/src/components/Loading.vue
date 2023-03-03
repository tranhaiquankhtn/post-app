<template>
  <div class="text-center">
    <v-overlay
      :model-value="isLoading"
      class="align-center justify-center"
    >
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
const props = defineProps({
isLoading: {
    type: Boolean,
    default: false
}

});
</script>
