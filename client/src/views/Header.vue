<template>
  <div>
    <b-nav>
      <b-nav-item v-if="id" @click="dashboard">&lt;Dashboard /&gt;</b-nav-item>
      <!-- <b-nav-item v-if="id" disabled>Dashboard</b-nav-item> -->
      <b-nav-item v-if="id" @click="createProblem">&lt;Create problem /&gt;</b-nav-item>
      <b-nav-item v-if="id" @click="contestSetting">&lt;Contest Setting /&gt;</b-nav-item>
      <b-nav-item v-if="id" @click="logout">&lt;Log out /&gt;</b-nav-item>
      <!-- <b-nav-item disabled>Disabled</b-nav-item> -->
    </b-nav>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      id: null
    }
  },
  methods: {
    logout() {
      axios.post('/api/auth/logout')
        .then(() => {
          // console.log('Logged out!');
          router.push("/");
        })
        .catch((err) => {
          console.log(err);
        })
    },
    ...mapActions(["updateUserSession"]),
    dashboard() {
      router.push("/dashboard");
    },
    createProblem() {
      router.push("/dashboard/create-problem");
    },
    contestSetting() {
      router.push("/dashboard/contest");
    }
  },
  async mounted() {
    try {
      await this.updateUserSession();
      this.id = this.$store.state.user._id;
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  }
}
</script>
