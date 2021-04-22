<template>
  <div>
    <el-main>
            <el-row>
              <el-col :span="24" :offset="1">
              <el-button
              class="mt-1"
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
                <el-form :model="newProjectValidate" ref="newProjectValidate">
                  <el-form-item
                    label="Project Name"
                    prop="title"
                    :rules="[
                      { required: true, message: 'Project name is required' },
                    ]"
                  >
                    <el-input
                      maxlength="40"
                      show-word-limit
                      v-model="newProjectValidate.title"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Short Description">
                    <el-input
                      type="textarea"
                      maxlength="200"
                      minlength="1"
                      show-word-limit
                      v-model="newProjectValidate.description"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="isNewProjectDialog = false"
                      >Cancel</el-button
                    >
                    <el-button
                      type="primary"
                      @click="validateProjectSubmit('newProjectValidate')"
                      >Create</el-button
                    >
                  </span>
                </template>
              </el-dialog>
              </el-col>
            </el-row>
      <el-row  type="flex" align="middle" justify="center">
        <el-col :span="10">
          <div>
            <!-- New Project Dialog -->
              <h1 class="ml-1">My Projects</h1>

              <!-- Project Loop -->
            <div
              v-for="project in projectsData.slice().reverse()"
              :key="project.key"
            >
              <div class="projectsWrapper">
                <el-row type="flex" justify="space-between">
                  <h2>{{ project.title }}</h2>
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
                        <p class="mt-1">
                          Total time assigned to tasks:
                          <span class="bold"> {{ addTime(project) }} </span>
                        </p>
                        <el-row type="flex">
                          <p>Users part of the project:</p>
                          <div
                            v-for="user in project.users.slice().reverse()"
                            :key="user.key"
                          >
                            <b class="users">
                              <i class="el-icon-user"></i>
                              {{ user.username + "\u00A0" }}</b
                            >
                          </div>
                        </el-row>
                        <p class="bold mt-1">Project Status</p>
                        <el-switch
                          v-model="project.completed"
                          active-text="Completed"
                          inactive-text="Ongoing"
                          @click="projectState(project._id)"
                        >
                        </el-switch>
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
        <el-col :span="10" :offset="1">
          <h1  class="ml-1">Projects I am invited</h1>
          <div
            v-for="project in invitedProjectsData.slice().reverse()"
            :key="project.key"
          >
            <div class="projectsWrapper">
              <el-row type="flex" justify="space-between">
                <h2>{{ project.title }}</h2>
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
                      <p class="mt-1">
                        Total time assigned to tasks:
                        <span class="bold"> {{ addTime(project) }} </span>
                      </p>
                      <el-row type="flex">
                        <p>Users part of the project:</p>
                        <div
                          v-for="user in project.users.slice().reverse()"
                          :key="user.key"
                        >
                          <b class="users"
                            ><i class="el-icon-user"></i>
                            {{ user.username + "\u00A0" }}</b
                          >
                        </div>
                      </el-row>
                      <p class="bold mt-1">Project Status</p>
                      <el-switch
                        v-model="project.completed"
                        active-text="Completed"
                        inactive-text="Ongoing"
                        @click="projectState(project._id)"
                      >
                      </el-switch>
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
            </div>
          </div>
          <!-- <DashboardComponent /> -->
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
  emits: ["refreshData"],
  data() {
    return {
      projectsData: [],
      invitedProjectsData: [],
      fullscreenLoading: true,
      isNewProjectDialog: false,
      newProjectValidate: {
        title: "",
        description: "",
      },

      projectStatus: null,
    };
  },
  mounted() {
    this.getProjectsData();
    this.getInvitedProjectsData();
    this.projectStatus = this.projectsData.completed;
  },

  methods: {
    addTime(project) {
      let total = 0;
      project.columns.forEach((column) => {
        column.tasks.forEach((task) => {
          if (task.task_time != null) {
            total += task.task_time;
          }
        });
      });

      let hours = total / 60;
      let rhours = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes = Math.round(minutes);
      return rhours + " hour(s) " + rminutes + " minute(s)";
    },

    async getProjectsData() {
      await axios
        .get("http://localhost:3000/api/projects")
        .then(
          (response) => (
            (this.projectsData = response.data),
            (this.fullscreenLoading = false),
            console.log(this.projectsData)
          )
        )
        .then(this.$emit("refreshData"));
    },

    async getInvitedProjectsData() {
      await axios
        .get(`${process.env.VUE_APP_BASE_URL_API}/api/projects/invited`)
        .then((response) => {
          (this.invitedProjectsData = response.data),
            (this.fullscreenLoading = false);
        });
    },

    async createProject() {
      await axios
        .post("http://localhost:3000/api/projects", {
          title: this.newProjectValidate.title,
          description: this.newProjectValidate.description,
          user: this.$store.state.auth.id,
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

    validateProjectSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createProject();
        } else {
          return false;
        }
      });
    },

    async projectState(projectID) {
      await axios
        .put(`http://localhost:3000/api/projects/${projectID}`, {
          completed: (this.projectStatus = !this.projectStatus),
        })
        .then((response) => {
          (this.projects = response.data), this.getProjectsData();
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
        (this.newProjectValidate.title = ""),
        (this.newProjectValidate.description = ""),
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
.bold {
  font-weight: 700;
}
.users {
  padding-left: 7px;
}
</style>