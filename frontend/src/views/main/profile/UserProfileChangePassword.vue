<template>
  <div>
    <v-container fluid>
      <v-card variant="outlined">
        <v-toolbar dark>
          <template #prepend>
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
              v-if="userProfile && userProfile.email"
              class="text-subtitle-1 text-blue-darken-2"
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
    const password: Ref<string> = ref('')
    const confirmed_password: Ref<string> = ref('')
    const passwordRules = [
      (v: string) => !!v || 'Password is required',
      (v: string) => (v && v.length > 6) || 'Name must be at least 6 character',
    ]
    const passwordConfirmedRules: any[] = [
      ...passwordRules,
      (v: string) =>
        (v && v === password.value) ||
        'Password and Confirmed Password are not matched',
    ]
    const userProfile: Ref<IUserProfile> = ref(
      readUserProfile(store) as IUserProfile,
    )
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
      const v = await (this.$refs.form as any).validate()
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

      (this.$refs.form as any).resetValidation()
    },
  },
})
</script>
