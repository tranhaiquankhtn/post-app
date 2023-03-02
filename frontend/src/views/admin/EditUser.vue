<template>
  <v-container fluid>
    <v-card variant="outlined">
      <v-toolbar dark>
        <template v-slot:prepend>
          <v-card-title primary-title class="text-info">Edit User</v-card-title>
        </template>
      </v-toolbar>
      <v-card-text>
        <div class="my-4">
          <div class="text-body-1 text-medium-emphasis text-grey-lighten-2">
            User
          </div>
          <div class="text-subtitle-1 text-blue-darken-2">
            {{
              userProfile && userProfile.full_name
                ? userProfile?.full_name
                : userProfile?.email
            }}
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
            label="Full Name"
            v-model="fullName"
            :rules="nameRules"
            required
          />
          <v-text-field
            label="E-mail"
            type="email"
            v-model="email"
            :rules="emailRules"
            required
          />
          <div class="subheading">
            User is superuser
            <span>
              (currently is {{ isSuperUser ? '' : 'not ' }}a superuser)</span
            >
          </div>
          <v-checkbox label="Is SuperUser" v-model="isSuperUser" color="info" />

          <div class="subheading">User is active</div>
          <v-checkbox label="Is active" v-model="isActive" color="info" />

          <!-- password -->
          <v-checkbox
            label="Set Password?"
            v-model="setPassword"
            color="info"
          />
          <v-text-field
            label="Password"
            type="password"
            v-model="password"
            :disabled="!setPassword"
            :rules="setPassword ? passwordRules : []"
          ></v-text-field>
          <v-text-field
            label="Confirm Password"
            type="password"
            :disabled="!setPassword"
            v-model="confirmed_password"
            :rules="setPassword ? passwordConfirmedRules : []"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel">Cancel</v-btn>
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
</template>

<script lang="ts">
import { ref, type Ref, defineComponent } from 'vue'

import { store } from '@/store'
import { readUserById } from '@/store/admin/getters'
import { dispatchUpdateUser } from '@/store/admin/actions'
import { IUserProfile, IUserProfileUpdate } from '@/types/profile'

export default defineComponent({
  setup() {
    const password = ref('')
    const passwordRules = [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length > 6) || 'Name must be at least 6 character',
    ]
    const userProfile: IUserProfile = ref(null)
    return {
      valid: ref(true),
      fullName: ref(''),
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => (v && v.length > 2) || 'Name must be at least 3 character',
      ],
      email: ref(''),
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) =>
          (v && /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v)) ||
          'Must be a valid email',
      ],
      isSuperUser: ref(false),
      isActive: ref(true),
      setPassword: ref(false),
      password,
      passwordRules,
      confirmed_password: ref(''),
      passwordConfirmedRules: [
        ...passwordRules,
        (v) =>
          (v && v === password.value) ||
          'Password and Confirmed Password are not matched',
      ],
      userProfile,
    }
  },

  methods: {
    async submit() {
      const v = await this.$refs.form.validate()
      if (!v.valid) {
        console.log('v=', v)
        return
      }
      const user: IUserProfileUpdate = {}
      if (this.fullName) {
        user.full_name = this.fullName
      }

      if (this.email) {
        user.email = this.email
      }

      user.is_active = this.isActive
      user.is_superuser = this.isSuperUser
      if (this.setPassword) {
        user.password = this.password
      }
      console.log('update_user=', user)
      await dispatchUpdateUser(store, {
        id: this.userProfile!.id,
        profile: user,
      })
      this.$router.push('/main/admin/users/all')
    },
    async reset() {
      this.password = ''
      this.confirmed_password = ''
      this.$refs.form.resetValidation()
    },
    cancel() {
      this.$router.push('/main/admin/users/all')
    },
  },
  mounted() {
    const user = readUserById(this.$store)(
      +this.$router.currentRoute.value.params.id,
    )
    if (user) {
      console.log('is_active: ', this.isActive)
      console.log('is_superuser: ', this.isSuperUser)
      this.fullName = user.full_name
      this.email = user.email
      this.isActive = user.is_active
      this.isSuperUser = user.is_superuser
      this.userProfile = { ...user }
      console.log('current_user=', this.userProfile)
    }
  },
})
</script>
