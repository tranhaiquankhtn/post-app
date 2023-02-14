<template>
  <div>
    <v-main>
      <v-container fill-height>
        <div>
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
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
              <v-flex class="caption text-sm-right">
                <router-link to="/recover-password"> Forgot your Password? </router-link>
              </v-flex>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click.prevent="submit" color="info" variant="flat">Login</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { appState } from '@/stores/state'
import { appName } from '@/env'
export default defineComponent({
  name: 'Login',
  setup() {
    const title = appName
    return {
      title,
    }
  },
  computed: {
    ...mapState(appState, ['loggedInError']),
  },
  methods: {
    submit() {
      console.log('submit')
    },
  },
})
</script>
