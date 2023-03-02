<template>
  <v-container fluid>
    <v-card class="mx-auto" variant="outlined">
      <v-toolbar dark flat>
        <template v-slot:prepend>
          <v-card-title primary-text class="text-info"
            >Edit Profile</v-card-title
          >
        </template>
      </v-toolbar>

      <v-divider></v-divider>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          fast-fail
          @submit.prevent
        >
          <v-text-field
            label="Full Name"
            v-model="fullName"
            :rules="nameRules"
            required
          ></v-text-field>
          <v-text-field
            label="E-mail"
            type="email"
            v-model="email"
            :rules="emailRules"
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
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'
import { IUserProfileUpdate } from '@/types/profile'
import { readUserProfile } from '@/store/main/getters'
import { dispatchUpdateUserProfile } from '@/store/main/actions'

import { commitAddNotification } from '@/store/main/mutations'
import { readFirstNotification } from '@/store/main/getters'

export default defineComponent({
  setup() {
    return {
      valid: true,
      fullName: ref(''),
      email: ref(''),
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => (v && v.length > 2) || 'Name must be at least 3 character',
      ],
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) =>
          (v && /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v)) ||
          'Must be a valid email',
      ],
    }
  },
  methods: {
    async submit() {
      const v = await this.$refs.form.validate()
      if (v.valid) {
        const updatedProfile: IUserProfileUpdate = {
          email: this.email,
          full_name: this.fullName,
        }
        await dispatchUpdateUserProfile(this.$store, updatedProfile)
        this.$router.push('/main/profile/view')
      }
    },
    reloadProfile() {
      const userProfile = readUserProfile(this.$store)

      if (userProfile) {
        this.fullName = userProfile.full_name
        this.email = userProfile.email
      }
    },
    reset() {
      this.reloadProfile()
      this.$refs.form.resetValidation()
    },
  },
  created() {
    this.reloadProfile()
  },
})
</script>
