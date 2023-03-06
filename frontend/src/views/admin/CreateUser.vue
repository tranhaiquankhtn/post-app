<template>
  <v-container fluid>
    <v-card variant="outlined">
      <v-toolbar dark>
        <template #prepend>
          <v-card-title primary-title class="text-info"
            >Create User</v-card-title
          >
        </template>
      </v-toolbar>
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
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

import { store } from '@/store'
import { dispatchCreateUser } from '@/store/admin/actions'

import { IUserProfileCreate } from '@/types/profile'

export default defineComponent({
  setup() {
    const password = ref('')
    const passwordRules = [
      (v: any) => !!v || 'Password is required',
      (v: any) => (v && v.length > 6) || 'Name must be at least 6 character',
    ]
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
      password,
      passwordRules,
      confirmed_password: ref(''),
      passwordConfirmedRules: [
        ...passwordRules,
        (v: any) =>
          (v && v === password.value) ||
          'Password and Confirmed Password are not matched',
      ],
    }
  },

  methods: {
    async submit() {
      const v = await (this.$refs.form as any).validate()
      if (!v.valid) {
        return
      }
      const user: IUserProfileCreate = {
        full_name: this.fullName,
        email: this.email,
        is_active: this.isActive,
        is_superuser: this.isSuperUser,
        password: this.password,
      }
      await dispatchCreateUser(store, user)
      this.$router.push('/main/admin/users/all')
    },
    async reset() {
      this.password = ''
      this.confirmed_password = ''
      (this.$refs.form as any).resetValidation()
    },
  },
})
</script>
