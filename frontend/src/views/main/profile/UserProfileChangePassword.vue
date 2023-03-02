<template>
  <div>
    <v-container fluid>
      <v-card variant="outlined">
        <v-toolbar dark>
          <template v-slot:prepend>
            <v-card-title primary-title class="text-info">
              Change Password</v-card-title
            >
          </template>
        </v-toolbar>
        <v-divider />
        <v-card-text>
          <div class="my-3">
            <div class="text-body-1 text-medium-emphasis text-grey-lighten-2">
              User
            </div>
            <div
              class="text-subtitle-1 text-blue-darken-2"
              v-if="userProfile && userProfile.email"
            >
              {{ userProfile.email }}
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
              label="Password"
              type="password"
              v-model="password"
              :rules="passwordRules"
              required
            ></v-text-field>
            <v-text-field
              label="Confirm Password"
              type="password"
              v-model="confirmed_password"
              :rules="passwordConfirmedRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="$router.back()">Cancel</v-btn>
          <v-btn @click="reset" color="error" variant="tonal">Reset</v-btn>
          <v-btn
            @click="submit"
            type="submit"
            color="info"
            variant="flat"
            :disabled="!valid"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'
import { store } from '@/store'
import { readUserProfile } from '@/store/main/getters'
import { dispatchUpdateUserProfile } from '@/store/main/actions'

import { IUserProfile, IUserProfileUpdate } from '@/types/profile'

export default defineComponent({
  setup() {
    const valid: Ref<boolean> = ref(true)
    const password: Ref<str> = ref('')
    const confirmed_password: Ref<str> = ref('')
    const passwordRules = [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length > 6) || 'Name must be at least 6 character',
    ]
    const passwordConfirmedRules = [
      ...passwordRules,
      (v) =>
        (v && v === password.value) ||
        'Password and Confirmed Password are not matched',
    ]
    const userProfile: Ref<IUserProfile> = readUserProfile(store)
    return {
      valid,
      password,
      confirmed_password,
      passwordRules,
      passwordConfirmedRules,
      userProfile,
    }
  },
  methods: {
    async submit() {
      const v = await this.$refs.form.validate()
      if (v.valid) {
        const updatedProfile: IUserProfileUpdate = {}
        updatedProfile.password = this.password
        await dispatchUpdateUserProfile(this.$store, updatedProfile)
        this.$router.push('/main/profile/view')
      }
    },
    reset() {
      this.password = ''
      this.confirmed_password = ''
      this.$refs.form.resetValidation()
    },
  },
})
</script>
