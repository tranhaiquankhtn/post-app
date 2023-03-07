<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="8" md="4">
        <v-card variant="outlined">
          <v-toolbar dark>
            <template #prepend>
              <v-card-title primary-title class="text-info">
                Reset Password</v-card-title
              >
            </template>
          </v-toolbar>
          <v-divider />
          <v-card-text>
            <div class="my-3">
              <div class="text-body-1 text-medium-emphasis text-grey-lighten-2">
                Enter your new password below
              </div>
            </div>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              fast-fail
              @submit.prevent
            >
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="passwordRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="confirmed_password"
                label="Confirm Password"
                type="password"
                :rules="passwordConfirmedRules"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="$router.back()">Cancel</v-btn>
            <v-btn color="error" variant="tonal" @click="reset">Reset</v-btn>
            <v-btn
              type="submit"
              color="info"
              variant="flat"
              :disabled="!valid"
              @click="submit"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import router from '@/router'
import { store } from '@/store'
import { dispatchResetPassword } from '@/store/main/actions'
import { commitAddNotification } from '@/store/main/mutations'

const valid: Ref<boolean> = ref(true)
const password: Ref<string> = ref('')
const confirmed_password: Ref<string> = ref('')
const passwordRules = [
  (v: any) => !!v || 'Password is required',
  (v: any) => (v && v.length > 6) || 'Name must be at least 6 character',
]
const passwordConfirmedRules: any[] = [
  ...passwordRules,
  (v: any) =>
    (v && v === password.value) ||
    'Password and Confirmed Password are not matched',
]

const form = ref(null)
const submit = async () => {
  const v = await form.value.validate()
  if (v.valid) {
    const token = checkToken()
    await dispatchResetPassword(store, { token: token, password: password.value })
    router.push('/')
  }
}

const reset = async () => {
  password.value = ''
  confirmed_password.value = ''
}

const checkToken = () => {
  const token = router.currentRoute.value.query.token as string
  if (token) {
    return token
  }
  commitAddNotification(store, {
    msg: 'No token provided in the URL',
    color: 'error',
  })
  router.push('/recover-password')
}

onMounted(() => checkToken())
</script>
