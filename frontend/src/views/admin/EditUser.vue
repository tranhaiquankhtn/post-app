<template>
  <v-container fluid>
    <v-card variant="outlined">
      <v-toolbar dark>
        <template #prepend>
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
            v-model="fullName"
            label="Full Name"
            :rules="nameRules"
            required
          />
          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            :rules="emailRules"
            required
          />
          <div class="subheading">
            User is superuser
            <span>
              (currently is {{ isSuperUser ? '' : 'not ' }}a superuser)</span
            >
          </div>
          <v-checkbox v-model="isSuperUser" label="Is SuperUser" color="info" />

          <div class="subheading">User is active</div>
          <v-checkbox v-model="isActive" label="Is active" color="info" />

          <!-- password -->
          <v-checkbox
            v-model="setPassword"
            label="Set Password?"
            color="info"
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            :disabled="!setPassword"
            :rules="setPassword ? passwordRules : []"
          ></v-text-field>
          <v-text-field
            v-model="confirmed_password"
            label="Confirm Password"
            type="password"
            :disabled="!setPassword"
            :rules="setPassword ? passwordConfirmedRules : []"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel">Cancel</v-btn>
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
      (v: any) => !!v || 'Password is required',
      (v: any) => (v && v.length > 6) || 'Name must be at least 6 character',
    ]
    const userProfile: Ref<IUserProfile | any> = ref(null)
    return {
      valid: ref(true),
      fullName: ref(''),
      nameRules: [
        (v: any) => !!v || 'Name is required',
        (v: any) => (v && v.length > 2) || 'Name must be at least 3 character',
      ],
      email: ref(''),
      emailRules: [
        (v: any) => !!v || 'Email is required',
        (v: any) =>
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
        (v: any) =>
          (v && v === password.value) ||
          'Password and Confirmed Password are not matched',
      ],
      userProfile,
    }
  },

  mounted() {
    const user = readUserById(this.$store)(
      +this.$router.currentRoute.value.params.id,
    )
    if (user) {
      this.fullName = user.full_name
      this.email = user.email
      this.isActive = user.is_active
      this.isSuperUser = user.is_superuser
      this.userProfile = { ...user }
      console.log('current_user=', this.userProfile)
    }
  },
  methods: {
    async submit() {
      const v = await (this.$refs.form as any).validate()
      if (!v.valid) {
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
      await dispatchUpdateUser(store, {
        id: this.userProfile!.id,
        profile: user,
      })
      this.$router.push('/main/admin/users/all')
    },
    async reset() {
      this.password = ''
      this.confirmed_password = ''
      (this.$refs.form as any).resetValidation()
    },
    cancel() {
      this.$router.push('/main/admin/users/all')
    },
  },
})
</script>
