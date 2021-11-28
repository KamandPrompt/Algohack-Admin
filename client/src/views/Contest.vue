<template>
  <div>
    <div v-if="!loading">
      <Header />
      <div v-if="got_user">
        <p>Admin: {{ user.name }}</p>
      </div>
      <div v-else>Loading...</div>
      <center>
        <h3>Contest Settings</h3>
      </center>
      Start Date and Time:
      <input type="date" name="startDate" v-model="startDate" />
      <input type="time" name="startTime" v-model="startTime" />
      <br />
      <br />End Date and Time:
      <input type="date" name="endDate" v-model="endDate" />
      <input type="time" name="endTime" v-model="endTime" />
      <br />
      <br />Maximum number of hints:
      <input type="text" name="maxHints" v-model="settings.maxHints" />
      <br />
      <br />
      <br />Point reducing constant K (0 - 1) i.e currScore := currScore * K:
      <input
        type="text"
        name="maxHints"
        v-model="settings.pointReductionConstant"
      />
      <br />
      <br />
      <br />Problems currently present (visible) in the contest:
      <br />
      <br />
      <b-form-checkbox-group
        v-model="problemsPresentInContest"
        :options="problemIDs"
      ></b-form-checkbox-group>
      <br />
      <span class="btn" @click="editSettings">
        <div v-if="submitted">&lt;Please Wait... /&gt;</div>
        <div v-else>&lt;Edit settings /&gt;</div>
      </span>
      <br />
      <span>
        <strong>{{ edited_res }}</strong>
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import { mapActions } from "vuex";
import Header from "../views/Header.vue";

export default {
  name: "Contest",
  data() {
    return {
      id: null,
      submitted: false,
      loading: true,
      got_user: false,
      edited_res: "",
      user: {
        name: "",
      },
      startTime: null,
      startDate: null,
      endDate: null,
      endTime: null,
      problemsPresentInContest: [],
      problemIDs: [],
      settings: {
        startDateTime: null,
        endDateTime: null,
        maxHints: null,
        pointReductionConstant: null,
      },
    };
  },
  components: {
    Header,
  },
  methods: {
    getUserData: async function () {
      await axios
        .get("/api/dashboard/user")
        .then((res) => {
          this.user.name = res.data.user.username;
          this.got_user = true;
        })
        .catch((errors) => {
          console.log(errors);
          router.push("/");
        });
    },
    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
    formatTime24H(date) {
      var d = new Date(date);
      var hours = "" + d.getHours();
      var minutes = "" + d.getMinutes();
      if (hours.length < 2) hours = "0" + hours;
      if (minutes.length < 2) minutes = "0" + minutes;
      var t = [hours, minutes].join(":");
      return t;
    },
    editSettings: async function () {
      if (this.submitted) return;
      this.submitted = true;
      this.settings.startDateTime = new Date(
        this.startDate + " " + this.startTime
      );
      this.settings.endDateTime = new Date(this.endDate + " " + this.endTime);
      this.settings.pointReductionConstant = parseFloat(
        this.settings.pointReductionConstant
      );
      await axios
        .post("/api/dashboard/edit/contest-setting", this.settings)
        .then(async () => {
          await axios
            .post(
              "/api/dashboard/edit/problems-visibility",
              this.problemsPresentInContest
            )
            .then(() => {
              this.submitted = false;
              this.edited_res = "Contest settings updated!";
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSettings: async function () {
      await axios
        .get("/api/dashboard/get/contest-setting")
        .then((res) => {
          this.settings = res.data;
          this.startDate = this.formatDate(this.settings.startDateTime);
          this.endDate = this.formatDate(this.settings.endDateTime);
          this.startTime = this.formatTime24H(this.settings.startDateTime);
          this.endTime = this.formatTime24H(this.settings.endDateTime);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProblemsMetadata: async function () {
      await axios
        .get("/api/dashboard/get/problems-metadata")
        .then((res) => {
          res.data.forEach((problem) => {
            this.problemIDs.push(problem.qID);
            if (problem.isPresentInContest) {
              this.problemsPresentInContest.push(problem.qID);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    ...mapActions(["updateUserSession"]),
  },
  async mounted() {
    try {
      await this.updateUserSession();
      this.id = this.$store.state.user._id;
      if (this.id !== null) {
        await this.getUserData();
        await this.getSettings();
        this.getProblemsMetadata();
        this.loading = false;
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  },
};
</script>

<style scoped>
.btn {
  margin-top: 20px;
  margin-right: 20px;
  padding: 10px;
  border: 1px solid green;
}
</style>