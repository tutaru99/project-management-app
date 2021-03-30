<template>
  <div>
    <el-main>
      <el-row type="flex">
        <el-col :span="10" :offset="2">
          <div>
            <h1>Projects</h1>
            <br />
            <!-- New Project Dialog -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="isNewProjectDialog = true"
            >
              New Project
            </el-button>
            <el-dialog
              title="Create New Project"
              v-model="isNewProjectDialog"
              width="30%"
            >
              <el-form>
                <el-form-item label="Project Name">
                  <el-input
                    maxlength="40"
                    minlength="1"
                    show-word-limit
                    v-model="title"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Short Description">
                  <el-input
                    type="textarea"
                    maxlength="200"
                    minlength="1"
                    show-word-limit
                    v-model="description"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="isNewProjectDialog = false"
                    >Cancel</el-button
                  >
                  <el-button type="primary" @click="createProject()"
                    >Create</el-button
                  >
                </span>
              </template>
            </el-dialog>
            <!-- Project Loop -->
            <div
              v-for="project in projectsData.slice().reverse()"
              :key="project.key"
            >
              <div class="projectsWrapper">
                <el-row type="flex" justify="space-between">
                  <h2>{{ project.title }}</h2> {{project._id}}  
                  <el-button
                    class="more"
                    icon="el-icon-delete"
                    @click="deleteProject(project._id)"
                    circle
                  ></el-button>
                </el-row>
                <p id="completed" v-if="project.completed == true">Completed</p>
                <p id="inProgress" v-else>Ongoing</p>

                <el-row>
                  <el-col :span="24">
                    <el-collapse>
                      <el-collapse-item title="About Project">
                        <h4>{{ project.description }}</h4>
                        <p>Total time assigned to tasks:</p>
                        <p>Users part of the project:</p>
                        <p>Project Status </p>
                        <el-radio-group v-model="projectStatus" size="medium">
                          <el-radio-button @click="projectState(project._id)" label="true"></el-radio-button>
                          <el-radio-button  @click="projectState(project._id)" label="false"></el-radio-button>
                        </el-radio-group>
                        {{ projectStatus }}
                      </el-collapse-item>
                    </el-collapse>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="end">
                  <router-link :to="{ path: '/projectboard/' + project._id }"
                    ><el-button class="mt-1" id="linkProject" type="primary"
                      >Open Project</el-button
                    ></router-link
                  >
                </el-row>
                <el-row type="flex" justify="end">
                  <span id="dateCreated"
                    >Created: {{ project.createdAt.split("T").shift() }}</span
                  >
                </el-row>
                <el-row> </el-row>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="11" :offset="1">
          <DashboardComponent />
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
// @ is an alias to /src
import DashboardComponent from "@/components/DashboardComponent.vue";
import axios from "axios";

export default {
  name: "Dashboard",
  components: {
    DashboardComponent,
  },
  data() {
    return {
      projectsData: [],
      fullscreenLoading: true,
      isNewProjectDialog: false,

      title: "",
      description: "",

      projectStatus: true
    };
  },
  mounted() {
    this.getProjectsData();

    this.projectStatus = this.projectsData.completed;
  },
  methods: {
    async getProjectsData() {
      await axios
        .get("http://localhost:3000/api/projects")
        .then(
          (response) => (
            (this.projectsData = response.data),
            (this.fullscreenLoading = false)
          )
        )
        .then(this.$emit("refreshData"));
    },

    async createProject() {
      await axios
        .post("http://localhost:3000/api/projects", {
          title: this.title,
          description: this.description,
        })
        .then(
          (response) => (
            (this.projects = response.data),
            console.log(response),
            this.closeProjDialog()
          )
        )
        .then(this.$emit("refreshData"));
    },


     async projectState(projectID) {
      await axios
        .put(`http://localhost:3000/api/projects/${projectID}`, {
          completed: this.projectStatus
        })
        .then((response) => {
          (this.projects = response.data), this.getProjectsData();;
        });
    },


    async deleteProject(projectID) {
      await axios
        .delete(`http://localhost:3000/api/projects/${projectID}`)
        .then((response) => {
          (this.projects = response.data), this.getProjectsData();
        })
        .then(this.$emit("refreshData"));
    },

    openFullScreen1() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },

    closeProjDialog() {
      (this.isNewProjectDialog = !this.isNewProjectDialog),
        (this.title = ""),
        (this.description = ""),
        this.getProjectsData();
    },
  },
};
</script>

<style lang="scss" scoped>
/* Shitty CSS for now */
.projectsWrapper {
  border: 1px solid rgb(0, 0, 0);
  padding: 10px;
  margin: 10px;
}
#completed {
  color: lightgreen;
  font-weight: 700;
}
#inProgress {
  color: gold;
  font-weight: 700;
}
#dateCreated {
  font-size: 13px;
}
#linkProject {
  font-size: 16px;
}
.mt-1 {
  margin-top: 10px;
}
</style>