<template>
  <div v-if="!loading">
    <Header />
    <div>
      <b-row class="question-title">
        <b-col>
          <center>
            <h2>{{ques.name}}</h2>
            Time limit: {{ques.timeLimit}} sec
            <br />
            Problem Setter: {{ques.problemSetter}}
          </center>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h4>Problem Statement</h4>
          <p class="question-segment" v-html="ques.description"></p>
          <h4>Input Format</h4>
          <p class="question-segment" v-html="ques.inputFormat"></p>
          <h4>Output Format</h4>
          <p class="question-segment" v-html="ques.outputFormat"></p>
          <h4>Constraints</h4>
          <p class="question-segment" v-html="ques.constraints"></p>
          <h4>Sample Input</h4>
          <p class="question-segment" v-html="ques.sampleInput"></p>
          <h4>Sample Output</h4>
          <p class="question-segment" v-html="ques.sampleOutput"></p>
        </b-col>
        <b-col cols="7">
          <h4>Code</h4>
          <canvas id="cv" :height="canvas_height" width="600"></canvas>
          <!-- <p class="code-segment">{{ques.incorrectSolution}}</p> -->
        </b-col>
      </b-row>
      <hr class="hr-tag" />
      <center>
        Input only .txt file in correct format.
        <input
          type="file"
          ref="fileInput"
          @change="selectedFileInput"
          required
        />
      </center>
      <center>
        <span class="btn" @click="hackIt">
          <div v-if="submitted">Please wait...</div>
          <div v-else>&lt;Hack it! /&gt;</div>
        </span>
      </center>
      <div class="submit-status">
        <center>
          <strong>
            <p>{{submit_status}}</p>
            <h3 :class="hack_class">{{hack_status}}</h3>
          </strong>
        </center>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import axios from "axios"
import router from "../router"
import { mapActions } from "vuex"
import Header from "../views/Header.vue"

export default {
  name: "TestProblem",
  props: ['qID'],
  data() {
    return {
      id: null,
      loading: true,
      ques: [],
      inputFile: '',
      submitted: false,
      submit_status: '',
      submit_status_code: -1,
      hack_status: '',
      hack_class: '',
      canvas_height: 300
    }
  },
  components: {
    Header
  },
  methods: {
    ...mapActions(["updateUserSession"]),
    async getProblemFromqID() {
      await axios.get(`/api/dashboard/get-problem/${this.qID}`)
        .then((res) => {
          if (res.data == '') {
            router.push("/");
          } else {
            this.ques = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    async selectedFileInput() {
      let file = this.$refs.fileInput.files[0];
      if (!file || file.type !== 'text/plain') return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.inputFile = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async checkInputFormat(callback) {
      const check_format_body = {
        source_code: this.ques.checkerProgram,
        language_id: "10",
        stdin: this.inputFile
      };
      await axios.post('/api/auth/judge0-sumbit', check_format_body)
        .then((res) => {
          const status = res.data.stderr;
          console.log("ip file: ", check_format_body.stdin);
          console.log("ip format status: ", status);
          if (status === 'SUCCESS\n') {
            // this.submit_status = 'Correct input format.'
            this.submit_status_code = 200;
          } else {
            // this.submit_status = 'Incorrect input format.'
            this.submit_status_code = 404;
          }
          callback();
        })
        .catch((err) => {
          console.log(err);
          this.submit_status_code = 500;
          callback();
        })
    },
    async getHackStatus() {
      var correct_stdout = '', incorrect_stdout = '';
      const correct_solution = {
        source_code: this.ques.correctSolution,
        language_id: this.ques.languageCode,
        stdin: this.inputFile
      };
      const incorrect_solution = {
        source_code: this.ques.incorrectSolution,
        language_id: this.ques.languageCode,
        stdin: this.inputFile
      };
      await axios.post('/api/auth/judge0-sumbit', correct_solution)
        .then((res) => {
          console.log("Correct: ", res.data.stdout);
          correct_stdout = res.data.stdout;
        })
        .catch((err) => {
          console.log(err);
        })
      await axios.post('/api/auth/judge0-sumbit', incorrect_solution)
        .then((res) => {
          console.log("Incorrect: ", res.data.stdout);
          incorrect_stdout = res.data.stdout;
        })
        .catch((err) => {
          console.log(err);
        })
      console.log(correct_stdout, incorrect_stdout);
      if (correct_stdout !== incorrect_stdout) {
        this.hack_status = "Successful hacking";
        this.hack_class = "success-hack";
      } else {
        this.hack_status = "Unsuccessful hacking";
        this.hack_class = "fail-hack";
      }
    },
    async hackIt() {
      if (this.submitted) return;
      this.submit_status = '';
      this.submitted = true;
      this.submit_status_code = -1;
      this.hack_status = '';
      this.hack_class = '';
      await this.checkInputFormat(async () => {
        if (this.submit_status_code === 500) {
          this.submit_status = "Something went wrong with the server.";
        } else if (this.submit_status_code === 404) {
          this.submit_status = "Incorrect input format.";
        } else if (this.submit_status_code === 200) {
          this.submit_status = "Correct input format.";
          await this.getHackStatus();
        }
        console.log(this.submit_status_code);
        this.submitted = false;
      });
    },
    draw: function () {
      const cv = document.getElementById('cv')
      const ctx = cv.getContext('2d')
      ctx.clearRect(0, 0, 400, 300)
      ctx.font = 12 + 'px' + ' ' + 'Courier New'
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = 'left'
      ctx.save()
      // ctx.translate(400 / 2, 300 / 2)
      var line = '';
      var maxWidth = 600;
      var x = 0, y = 25;
      var lineHeight = 25;
      var lines = this.ques.incorrectSolution.split('\n');
      for (var i = 0; i < lines.length; i++) {
        var words = lines[i].split(' ');
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y);
        y += lineHeight;
        line = '';
      }
      ctx.fillText(line, x, y);
      this.canvas_height = y + 20;
      ctx.restore()
    },
    emitDataURL: function () {
      const dataURL = document.getElementById('cv').toDataURL('image/png')
      this.$emit('updated', dataURL)
    }
  },
  async mounted() {
    try {
      await this.updateUserSession();
      this.id = this.$store.state.user._id;
      if (this.id !== null) {
        await axios.get(`/api/dashboard/qIDexists/${this.qID}`)
          .then(async (res_exists) => {
            if (res_exists.data.exists) {
              await this.getProblemFromqID();
              this.loading = false;
              this.draw();
              this.emitDataURL();
              this.draw2();
            } else {
              router.push("/");
            }
          })
          .catch((err) => {
            console.log(err);
          })
        this.loading = false;
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  },
  updated() {
    this.draw()
    this.emitDataURL()
  }
}
</script>

<style scoped>
.question-segment {
  white-space: pre-wrap;
}
.code-segment {
  white-space: pre-wrap;
  user-select: none;
}
#cv {
  white-space: pre-wrap;
}
.question-title {
  margin-bottom: 30px;
}
.hr-tag {
  border: 1px dashed rgb(219, 164, 11);
}
.btn {
  margin-top: 20px;
  margin-right: 20px;
  padding: 10px;
  border: 1px solid green;
}
.submit-status {
  margin-top: 20px;
  font-size: 20px;
}
.success-hack {
  color: green;
}
.fail-hack {
  color: rgb(255, 60, 60);
}
</style>
