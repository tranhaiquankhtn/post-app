<template>
  <v-container fluid>
    <v-card class="mx-auto" variant="outlined">
      <v-toolbar dark flat>
        <template #prepend>
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
            v-model="fullName"
            label="Full Name"
            :rules="nameRules"
            required
          ></v-text-field>
          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            :rules="emailRules"
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

import { readFirstNotification } from '@/store/main/getters'

export default defineComponent({
  setup() {
    return {
      valid: true,
      fullName: ref(''),
      email: ref(''),
      nameRules: [
        (v: any) => !!v || 'Name is required',
        (v: any) => (v && v.length > 2) || 'Name must be at least 3 character',
      ],
      emailRules: [
        (v: any) => !!v || 'Email is required',
        (v: any) =>
          (v && /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v)) ||
          'Must be a valid email',
      ],
    }
  },
  created() {
    this.reloadProfile()
  },
  methods: {
    async submit() {
      const v = await (this.$refs.form as any).validate()
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
      (this.$refs.form as any).resetValidation()
    },
  },
})
</script>
