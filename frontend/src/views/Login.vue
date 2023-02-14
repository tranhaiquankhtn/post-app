<template>
  <div>
    <v-main>
      <v-container fluid fill-height fill-width>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>{{ appName }}</v-toolbar-title>
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
                <div v-if="logInError">
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
                <v-btn @click.prevent="submit" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Login',
})
</script>
