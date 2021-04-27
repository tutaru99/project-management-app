<template>
  <div class="template">
    <el-main>
      <el-row type="flex" align="middle" justify="space-around" class="header">
        <el-col :span="7">
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
                  :rows="5"
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
        <el-col :span="8">
              <h3>Project Management Application</h3>
        </el-col>
        <el-col :span="4">
          <el-row type="flex" justify="end">
                    <div style="text-align: right">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          placement="top"
                          :content="$store.state.auth.username"
                        >
                          <el-avatar>
                             {{ $store.state.auth.username.charAt(0).toUpperCase() }}
                          </el-avatar>
                        </el-tooltip>
                    </div>

          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="center">
        <el-col :span="10">
          <div>
            <h3 class="ml-1 mt-5" v-if="projectsData.length">Personal Projects</h3>
            <h3 class="ml-1 mt-5" v-else>No Projects Created..</h3>

            <!-- Project Loop -->
            <div
              v-for="project in projectsData.slice().reverse()"
              :key="project.key"
            >
              <div class="projectsWrapper">
                <el-row type="flex" justify="space-between">
                  <h3 class="textTitle">{{ project.title }}</h3>
                  <el-button
                    class="more"
                    type="danger"
                    plain
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
                        <p>{{ project.description }}</p>
                        <p class="mt-1">
                          Total time assigned to tasks:
                          <span class="bold"> {{ addTime(project) }} </span>
                        </p>
                        <el-row type="flex">
                          <p v-if="project.users.length">Users part of the project:</p>
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
                          active-color="#13ce66"
                          inactive-color="#8112EA"
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
          <h3 class="ml-1 mt-5" v-if="invitedProjectsData.length">
            Shared Projects
          </h3>
          <h3 class="ml-1 mt-5" v-else>No Shared Projects Added..</h3>
          <div
            v-for="project in invitedProjectsData.slice().reverse()"
            :key="project.key"
          >
            <div class="projectsWrapper">
              <el-row type="flex" justify="space-between">
                <h3 class="textTitle">{{ project.title }}</h3>
                <el-button
                  class="more"
                  icon="el-icon-delete"
                  type="danger"
                  plain
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
                      <p>{{ project.description }}</p>
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
                        active-color="#13ce66"
                        inactive-color="#8112EA"
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

      if (rhours > 0 || rminutes > 0) {
        return rhours + " hour(s) " + rminutes + " minute(s)";
      } else {
        return "No Estimations";
      }
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
          (this.projects = response.data), this.getProjectsData(), this.getInvitedProjectsData();
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
.template{
  height: 100vh;
  background-color: #191a1f;


  .header{
  background-color: #121318 !important;
  box-shadow: 0 0 2px #8112ea;
  height: 50px;
  }
  .el-row--flex.is-align-middle{
  background-color: #191a1f;
  }
  .el-avatar {
  background: #8112EA;
  width: 35px;
  height: 35px;
  line-height: 35px;
  cursor: context-menu;
  font-weight: 500;
  }
  .projectsWrapper {
  border-radius: 4px;
  box-shadow: 0 0 2px #8112ea;
  background-color: #121318;
  padding: 10px;
  margin: 10px;

    .users {
    padding-left: 7px;
    color: white;
    }
  }
}


.textTitle{
  color: #d0cae5;
}
h3{
  color: white;
}
p{
  color: white;
  letter-spacing: 0.3px;
  font-weight: 500;
  word-break: break-all;
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
.mt-5 {
  margin-top:70px;
}
.bold {
  font-weight: 700;
}

</style>