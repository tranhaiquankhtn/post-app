<template>
    <v-main>
      <v-container >
        <v-layout full-height overlaps>
          <v-card class="elevation-12">
            <v-toolbar color="info" dark flat>
              <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @keyup.enter="submit">
                <v-text-field
                  @keyup.enter="submit"
                  v-model="email"
                  prepend-icon="mdi-account"
                  name="login"
                  label="Login"
                  type="text"
                >
                </v-text-field>

                <v-text-field
                  @keyup.enter="submit"
                  v-model="password"
                  type="password"
                  prepend-icon="mdi-lock"
                  name="password"
                  label="Password"
                  id="password"
                />
              </v-form>
              <div v-if="loggedInError">
                <v-alert transition="fade-transition" type="error">
                  Incorrect email or Password
                </v-alert>
              </div>
              <v-spacer></v-spacer>
              <div class="caption text-sm-right">
                <router-link to="/recover-password"> Forgot your Password? </router-link>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click.prevent="submit" color="info" variant="flat">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-container>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { dispatchLogIn } from '@/store/main/actions';
import { readLoggedInError } from '@/store/main/getters';
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
    loggedInError: () => readLoggedInError(store)
  },
  methods: {
    async submit() {
        await dispatchLogIn(this.$store, { username: this.email, password: this.password })
    },
  },
})
</script>
