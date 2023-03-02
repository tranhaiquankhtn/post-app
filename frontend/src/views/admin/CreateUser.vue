<template>
  <v-container fluid>
    <v-card variant="outlined">
      <v-toolbar dark>
        <template v-slot:prepend>
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
          <v-checkbox label="Is SuperUser" v-model="isSuperUser" color="info"/>

          <div class="subheading">User is active</div>
          <v-checkbox label="Is active" v-model="isActive" color="info"/>

          <!-- password -->
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
</template>

<script lang="ts">
import { ref, type Ref, defineComponent } from 'vue'

import { store } from '@/store'
import { dispatchCreateUser } from '@/store/admin/actions'

import { IUserProfileCreate } from '@/types/profile'

export default defineComponent({
  setup() {
    const password = ref('')
    const passwordRules = [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length > 6) || 'Name must be at least 6 character',
    ]
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
      password,
      passwordRules,
      confirmed_password: ref(''),
      passwordConfirmedRules: [
        ...passwordRules,
        (v) =>
          (v && v === password.value) ||
          'Password and Confirmed Password are not matched',
      ],
    }
  },

  methods: {
    async submit() {
      const v = await this.$refs.form.validate()
      if (!v.valid) {
        console.log('v=', v)
        return
      }
      const user: IUserProfileCreate = {
        fullName: this.fullName,
        email: this.email,
        isActive: this.isActive,
        isSuperUser: this.isSuperUser,
        password: this.password,
      }
      console.log('user=', user)
      await dispatchCreateUser(store, user)
      this.$router.push('/main/admin/users/all')
    },
    async reset() {
      this.password = ''
      this.confirmed_password = ''
      this.$refs.form.resetValidation()
    },
  },
})
</script>
