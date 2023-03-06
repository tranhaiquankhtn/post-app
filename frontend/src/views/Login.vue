<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout>
        <v-row justify="center">
          <v-col xs="12" sm="8" md="4">
            <v-card class="elevation-12" dark>
              <v-toolbar color="info" dark density="comfortable">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form @keyup.enter="submit">
                  <v-text-field
                    v-model="email"
                    prepend-icon="mdi-account"
                    name="login"
                    label="Login"
                    type="text"
                    density="compact"
                    @keyup.enter="submit"
                  >
                  </v-text-field>

                  <v-text-field
                    id="password"
                    v-model="password"
                    type="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    density="compact"
                    @keyup.enter="submit"
                  />
                </v-form>
                <div v-if="loggedInError">
                  <v-alert
                    transition="fade-transition"
                    type="error"
                    density="compact"
                  >
                    Incorrect email or Password
                  </v-alert>
                </div>
                <v-spacer></v-spacer>
                <div class="caption text-sm-right">
                  <router-link to="/recover-password">
                    Forgot your Password?
                  </router-link>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="info" @click.prevent="submit"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { dispatchLogIn } from '@/store/main/actions'
import { readLoggedInError } from '@/store/main/getters'
import { store } from '@/store'
import { appName } from '@/env'
const title = appName
export default defineComponent({
  setup() {
    return {
      title,
      email: ref(''),
      password: ref(''),
    }
  },
  computed: {
    loggedInError: () => readLoggedInError(store),
  },
  methods: {
    async submit() {
      await dispatchLogIn(this.$store, {
        username: this.email,
        password: this.password,
      })
    },
  },
})
</script>
