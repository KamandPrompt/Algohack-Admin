<template>
  <div>
    <div v-if="!loading">
      <Header />
      <center>
        <h3>Edit Problem</h3>
      </center>
      <b-row class="create-problem-container" v-if="!ques_loading">
        <b-col>
          <div>
            <!-- <b-form-group id="input-group-1" label="Problem code:" label-for="input-1">
              <b-form-input id="input-1" v-model="ques.qID" required></b-form-input>
            </b-form-group>-->
            <b-row>
              <b-col sm="3">Problem Code:</b-col>
              <b-col sm="6">
                <strong>{{qID}}</strong>
              </b-col>
            </b-row>
            <br />

            <b-form-group id="input-group" label="Problem setter name:" label-for="input">
              <b-form-input id="input" v-model="ques.problemSetter" required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Problem name:" label-for="input-2">
              <b-form-input id="input-2" v-model="ques.name" required></b-form-input>
            </b-form-group>

            <label for="description">Problem description:</label>
            <b-form-textarea id="description" v-model="ques.description" rows="7" required></b-form-textarea>

            <label for="inputFormat">Problem input format:</label>
            <b-form-textarea id="inputFormat" v-model="ques.inputFormat" rows="7" required></b-form-textarea>

            <label for="outputFormat">Problem output format:</label>
            <b-form-textarea id="outputFormat" v-model="ques.outputFormat" rows="7" required></b-form-textarea>

            <label for="constraints">Problem constraints:</label>
            <b-form-textarea id="constraints" v-model="ques.constraints" rows="7" required></b-form-textarea>

            <br />Sample input (.txt):
            <b-form-textarea id="sample_input" v-model="ques.sampleInput" rows="2" max-rows="8"></b-form-textarea>
            <br />OR
            <br />
            <input type="file" ref="fileSampleInput" @change="selectedFileSampleInput" required />

            <br />
            <br />Sample output (.txt):
            <b-form-textarea id="sample_output" v-model="ques.sampleOutput" rows="2" max-rows="8"></b-form-textarea>
            <br />OR
            <br />
            <input type="file" ref="fileSampleOutput" @change="selectedFileSampleOutput" required />

            <br />
            <br />
            <b-form-group id="input-group-3" label="Time limit (sec):" label-for="input-3">
              <b-form-input id="input-3" v-model="ques.timeLimit" required></b-form-input>
            </b-form-group>
          </div>
        </b-col>
        <b-col>
          <b-form-group label="Solution compiler:">
            <b-form-radio v-model="ques.languageCode" name="lang-code" value="10">C++ (g++ 7.2.0)</b-form-radio>
            <b-form-radio v-model="ques.languageCode" name="lang-code" value="36">Python (2.7.9)</b-form-radio>
          </b-form-group>
          <br />
          <strong class="correct-soln">Correct solution</strong> (Compiler: C++ (g++ 7.2.0)
          <strong>upload .cpp file</strong>), will
          <strong>not</strong> be shown in the actual contest problem:
          <br />
          <b-form-textarea
            id="correct_solution"
            v-model="ques.correctSolution"
            rows="2"
            max-rows="15"
          ></b-form-textarea>
          <br />OR
          <br />
          <input
            type="file"
            ref="fileCorrectSolution"
            @change="selectedFileCorrectSolution"
            required
          />

          <br />
          <br />
          <strong class="incorrect-soln">Incorrect solution</strong> (Compiler: C++ (g++ 7.2.0)
          <strong>upload .cpp file</strong>), will be given in the actual contest problem:
          <br />
          <b-form-textarea
            id="incorrect_solution"
            v-model="ques.incorrectSolution"
            rows="2"
            max-rows="15"
          ></b-form-textarea>
          <br />OR
          <br />
          <input
            type="file"
            ref="fileIncorrectSolution"
            @change="selectedFileIncorrectSolution"
            required
          />

          <br />
          <br />
          <strong>Checker Program</strong> (Compiler: C++ (g++ 7.2.0)
          <strong>upload .cpp file</strong>), will be used to check the user input file format:
          <br />
          <b-form-textarea
            id="checker_program"
            v-model="ques.checkerProgram"
            rows="2"
            max-rows="15"
          ></b-form-textarea>
          <br />OR
          <br />
          <input type="file" ref="fileCheckerProgram" @change="selectedFileCheckerProgram" required />

          <br />
          <br />
          <label for="hint">Problem hint:</label>
          <b-form-textarea id="hint" v-model="ques.hint" rows="3" required></b-form-textarea>

          <b-form-group id="input-group-4" label="Points (Integer):" label-for="input-4">
            <b-form-input id="input-4" v-model="ques.points" required></b-form-input>
          </b-form-group>

          <center>
            <span class="btn" @click="editProblem">
              <div v-if="submitted">Please wait...</div>
              <div v-else>&lt;Edit problem /&gt;</div>
            </span>
          </center>
        </b-col>
      </b-row>
      <div class="submit-status">
        <center>
          <strong>
            <h3>{{submit_status}}</h3>
          </strong>
        </center>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios"
import router from "../router"
import { mapActions } from "vuex"
import Header from "../views/Header.vue"

export default {
  name: "EditProblem",
  props: ['qID'],
  data() {
    return {
      submit_status: '',
      submitted: false,
      id: null,
      loading: true,
      ques_loading: true,
      ques: {
        qID: '',
        name: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        sampleInput: '',
        sampleOutput: '',
        timeLimit: '',
        correctSolution: '',
        incorrectSolution: '',
        checkerProgram: '',
        hint: '',
        points: '',
        problemSetter: ''
      }
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
            this.ques_loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    async selectedFileSampleInput() {
      let file = this.$refs.fileSampleInput.files[0];
      if (!file || file.type !== 'text/plain') return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.ques.sampleInput = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async selectedFileSampleOutput() {
      let file = this.$refs.fileSampleOutput.files[0];
      if (!file || file.type !== 'text/plain') return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.ques.sampleOutput = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async selectedFileCorrectSolution() {
      let file = this.$refs.fileCorrectSolution.files[0];
      if (!file) return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.ques.correctSolution = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async selectedFileIncorrectSolution() {
      let file = this.$refs.fileIncorrectSolution.files[0];
      if (!file) return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.ques.incorrectSolution = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async selectedFileCheckerProgram() {
      let file = this.$refs.fileCheckerProgram.files[0];
      if (!file) return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.ques.checkerProgram = evt.target.result;
        // console.log(this.ques.checkerProgram);
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async editProblem() {
      if (this.submitted) return;
      this.submit_status = '';
      if (this.ques.qID == '') {
        this.submit_status = 'Problem code cannot be left blank';
      } else {
        this.ques.timeLimit = parseFloat(this.ques.timeLimit);
        this.ques.points = parseInt(this.ques.points);
        this.ques.languageCode = parseInt(this.ques.languageCode);
        if (this.ques.languageCode === 36)
          this.ques.language = 'Python (2.7.9)';
        else if (this.ques.languageCode === 10)
          this.ques.language = 'C++ (g++ 7.2.0)';
        this.submitted = true;

        await axios.post(`/api/dashboard/edit/problem`, this.ques)
          .then(async () => {
            this.submit_status = 'Edited successfully!';
          })
          .catch((err) => {
            this.submit_status = 'Could not edit! :(';
            console.log(err);
          })
        this.submitted = false;
      }
    }
  },
  async mounted() {
    try {
      await this.updateUserSession();
      this.id = this.$store.state.user._id;
      if (this.id !== null) {
        this.loading = false;
        await this.getProblemFromqID();
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
.create-problem-container {
  padding-left: 15px;
  margin-top: 20px;
}

.btn {
  margin-top: 20px;
  margin-right: 20px;
  padding: 10px;
  border: 1px solid green;
}

.correct-soln {
  color: green;
}

.incorrect-soln {
  color: red;
}

.submit-status {
  margin-top: 20px;
  font-size: 20px;
}
</style>
