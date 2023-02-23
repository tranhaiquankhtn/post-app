<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapWritableState } from 'pinia'
import { appState } from '@/stores'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const store = appState()
    return {
      store,
    }
  },
  methods: {
    greetUser() {
      console.log('userProfile: ', this.store.userProfile)
      if (this.store.userProfile) {
        if (this.store.userProfile?.fullName) {
          return this.store.userProfile?.fullName
        }
        return this.store.userProfile?.email
      }
      return ''
    },
  },
})
</script>

<template>
  <v-main>
    <v-container>
      <v-card
        class="mx-auto"
        variant="outlined"
        title="Dashboard"
        subtitle="Subtitle"
        :text="'Welcome ' + greetUser()"
      >
        <v-card-actions>
          <v-btn to="/main/profile/view" color="secondary" variant="flat">View Profile</v-btn>
          <v-btn to="/main/profile/edit" color="primary" variant="flat">Edit Profile</v-btn>
          <v-btn to="/main/profile/password" color="error" variant="flat">Change Profile</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>
