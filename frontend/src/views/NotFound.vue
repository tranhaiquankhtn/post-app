<template>
  <v-container fluid>
    <v-card class="ma-3 pa-3" variant="outlined">
      <v-card-text>
        <div class="text-center">
          <v-icon color="grey" size="128">mdi-alert-circle-outline</v-icon>
        </div>
        <v-card-title>
          <div class="text-h4 text-center">Page not found</div>
        </v-card-title>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          color="info"
          prepend-icon="mdi-home-outline"
          @click="$router.push('/')"
          >Back</v-btn
        >
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts"></script>
