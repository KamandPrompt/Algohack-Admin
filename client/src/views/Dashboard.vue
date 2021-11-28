<template>
  <div>
    <div v-if="!loading">
      <Header />
      <div v-if="got_details">
        <p>Admin: {{ user.name }}</p>
      </div>
      <div v-else>Loading...</div>
      <b-col sm="6" offset="3">
        <div>
          <center>
            <h3 v-if="!table_loading">My problems</h3>
            <h3 v-if="table_loading">Table loading...</h3>
          </center>
          <b-table :items="all_problems" :fields="fields">
            <template v-slot:cell(qID)="data">
              <router-link :to="`/dashboard/test/${data.value}`">{{data.value}}</router-link>
            </template>
            <template v-slot:cell(edit)="data">
              <router-link :to="`/dashboard/edit/${data.value}`">Edit</router-link>
            </template>
            <!-- <template v-slot:cell(delete)="data">
              <div class="dlt-btn" @click="deleteQues(data.value)">Delete</div>
            </template> -->
          </b-table>
        </div>
      </b-col>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import router from "../router"
import { mapActions } from "vuex"
import Header from "../views/Header.vue"

export default {
  name: "Login",
  data() {
    return {
      id: null,
      loading: true,
      got_details: false,
      table_loading: true,
      all_problems: [],
      user: {
        name: ''
      },
      fields: ['qID', 'name', 'points', 'isPresentInContest', 'edit']
    }
  },
  components: {
    Header
  },
  methods: {
    getUserData: function () {
      axios.get("/api/dashboard/user")
        .then((res) => {
          this.user.name = res.data.user.username;
          this.got_details = true;
        })
        .catch((errors) => {
          console.log(errors)
          router.push("/")
        })
    },
    getAllProblems() {
      axios.get("/api/dashboard/all-problems")
        .then((res) => {
          this.all_problems = res.data;
          this.all_problems.forEach(function (part, index) {
            this[index].edit = res.data[index].qID;
            // this[index].delete = res.data[index].qID;
            this[index].isPresentInContest = (res.data[index].isPresentInContest ? "Yes" : "No");
          }, this.all_problems);
          this.table_loading = false;
          console.log(this.all_problems);
        })
        .catch((err) => {
          console.log(err);
        })
    },
    removeByAttr (arr, attr, value) {
      var i = arr.length;
      while (i--) {
        if (arr[i]
          && (arguments.length > 2 && arr[i][attr] === value)) {

          arr.splice(i, 1);

        }
      }
      return arr;
    },
    async deleteQues(qID) {
      await axios.post(`/api/dashboard/delete/${qID}`)
        .then(() => {
          this.all_problems = this.removeByAttr(this.all_problems, 'qID', qID);
        })
        .catch((err) => {
          console.log(err);
        })
    },
    ...mapActions(["updateUserSession"])
  },
  async mounted() {
    try {
      await this.updateUserSession();
      this.id = this.$store.state.user._id;
      if (this.id !== null) {
        this.getUserData();
        this.getAllProblems();
        this.loading = false;
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  }
}
</script>

<style scoped>
.dlt-btn {
  color: rgb(251, 112, 112);
}
.dlt-btn:hover {
  cursor: pointer;
  color: rgb(251, 112, 112);
}
</style>
