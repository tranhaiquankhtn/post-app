<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout>
        <v-row justify="center">
          <v-col xs="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="info" dark density="comfortable">
                <v-card-title>Password Recovery</v-card-title>
              </v-toolbar>
              <v-card-item>
                <div>
                  <p class="text-subtitle-2">
                    A password recovery email will be sent to registered account
                  </p>
                </div>
                <v-container>
                  <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    @keyup.enter="submit"
                    @submit.prevent=""
                  >
                    <v-text-field
                      v-model="email"
                      prepend-icon="mdi-email"
                      name="email"
                      label="Email"
                      type="text"
                      density="compact"
                      :rules="[
                        (v: any) => !!v || 'Email is required',
                        (v: any) =>
                        (v && /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v)) ||
                        'Must be a valid email',
                      ]"
                      @keyup.enter="submit"
                    >
                    </v-text-field>
                  </v-form>
                </v-container>
              </v-card-item>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="cancel">Cancel</v-btn>
                <v-btn
                  color="info"
                  class="flat"
                  :disabled="!valid"
                  @click.prevent="submit"
                  >Recover</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'

import { store } from '@/store'
import { dispatchRecoverPassword } from '@/store/main/actions'

const valid = ref(true)
const email = ref('')

const cancel = async () => {
  router.back()
}
const submit = async () => {
  await dispatchRecoverPassword(store, { email: email.value })
}
</script>
