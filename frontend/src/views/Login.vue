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
        </div>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { dispatchLogIn } from '@/store/main/actions';
import { readLoggedInError } from '@/store/main/getters';
import { appName } from '@/env'
const title = appName
export default defineComponent({
  data() {
    return {
      title,
      email: '',
      password: '',
    }
  },
  computed: {
    loggedInError: () => readLoggedInError(this.$store)
  },
  methods: {
    async submit() {
        await dispatchLogIn(this.$store, { username: this.email, password: this.password })
    },
  },
})
</script>
