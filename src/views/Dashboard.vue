<template>
  <div class="template">
    <el-main>
      <el-affix position="top" :offset="0.1">
        <el-row
          type="flex"
          align="middle"
          justify="space-around"
          class="header"
        >
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
                  <el-badge is-dot class="item" type="success">
                    <el-avatar>
                      {{ $store.state.auth.username.charAt(0).toUpperCase() }}
                    </el-avatar>
                  </el-badge>
                </el-tooltip>
                <el-dropdown trigger="click" placement="bottom-start">
                  <el-button
                    class="moreDropdown"
                    icon="el-icon-caret-bottom"
                    size="mini"
                    type="info"
                    circle
                  ></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        icon="el-icon-edit"
                        @click="changePassDialog = true"
                        >Change Password</el-dropdown-item
                      >
                      <el-dropdown-item icon="mdi mdi-logout" @click="logout"
                        >Sign Out</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-dialog
                  :before-close="closePassDialog"
                  v-model="changePassDialog"
                  width="25%"
                >
                  <el-form :model="changePassValidate" ref="changePassValidate">
                    <el-form-item
                      label="Old Password"
                      prop="oldPassword"
                      :rules="[
                        { required: true, message: 'Password is required' },
                      ]"
                    >
                      <el-input
                        @keydown.space.prevent
                        @paste.prevent
                        type="password"
                        maxlength="30"
                        minlength="6"
                        show-password
                        show-word-limit
                        v-model="changePassValidate.oldPassword"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="New Password"
                      prop="newPassword"
                      :rules="[
                        { required: true, message: 'Password is required' },
                      ]"
                    >
                      <el-input
                        @keydown.space.prevent
                        @paste.prevent
                        type="password"
                        maxlength="30"
                        minlength="6"
                        show-password
                        show-word-limit
                        v-model="changePassValidate.newPassword"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="Repeat New Password"
                      prop="newPassword2"
                      :rules="[
                        { required: true, message: 'Password is required' },
                      ]"
                    >
                      <el-input
                        @keydown.space.prevent
                        @paste.prevent
                        type="password"
                        maxlength="30"
                        minlength="6"
                        show-password
                        show-word-limit
                        v-model="changePassValidate.newPassword2"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <div class="pb-2">
                      <p
                        v-if="
                          !isValidPassword() &&
                            changePassValidate.oldPassword.length >= 1 &&
                            changePassValidate.newPassword.length >= 1 &&
                            changePassValidate.newPassword2.length >= 1
                        "
                        id="passwordWarning"
                      >
                        Password must have at least 6 characters
                      </p>
                      <p v-if="!isPasswordMatching()" id="passwordWarning">
                        Passwords do not match
                      </p>
                      <p id="passwordWarning">
                        {{ errors }}
                      </p>
                    </div>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="closePassDialog">Cancel</el-button>
                      <el-button
                        @click="validateUpdatePassword('changePassValidate')"
                        type="primary"
                        >Update</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </el-affix>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <div>
            <h3 class="ml-1 mt-5" v-if="projectsData.length">
              Personal Projects
            </h3>
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
                <p id="completed" v-if="project.completed == true"><span id="projCompleted">Project is</span> Completed</p>
                <p id="inProgress" v-else><span id="projCompleted">Project is</span> Ongoing</p>
                <el-row>
                  <el-col :span="24">
                    <el-collapse>
                      <el-collapse-item title="Project Details">
                        <p>{{ project.description }}</p>
                        <p class="mt-1">
                          Total time assigned to tasks:
                          <span class="bold"> {{ addTime(project) }} </span>
                        </p>
                        <el-row type="flex">
                          <p v-if="project.users.length">
                            Users part of the project:
                          </p>
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
        <el-col :span="8" :offset="1">
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
                  disabled
                ></el-button>
              </el-row>
              <p id="completed" v-if="project.completed == true"><span id="projCompleted">Project is</span> Completed</p>
              <p id="inProgress" v-else><span id="projCompleted">Project is</span> Ongoing</p>
              <el-row>
                <el-col :span="24">
                  <el-collapse>
                    <el-collapse-item title="Project Details">
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
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "Dashboard",
  components: {

  },
  emits: ["refreshData"],
  data() {
    return {
      projectsData: [],
      invitedProjectsData: [],
      fullscreenLoading: true,
      isNewProjectDialog: false,
      changePassDialog: false,
      newProjectValidate: {
        title: "",
        description: "",
      },
      changePassValidate: {
        oldPassword: "",
        newPassword: "",
        newPassword2: "",
      },

      projectStatus: null,
      errors: null,
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
            (this.fullscreenLoading = false)
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
            (this.projects = response.data), this.closeProjDialog()
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
          (this.projects = response.data),
            this.getProjectsData(),
            this.getInvitedProjectsData();
        })
        .then(this.$emit("refreshData"));
    },

    //making sure form fields are required and cannot be bypassed
    validateUpdatePassword(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.isValidPassword();
          if (this.isValidPassword() === true) {
            await this.updatePassword()
              .then(() => {
                this.updatePassSuccess();
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    },
    updatePassword() {
      return new Promise(async (resolve, reject) => {
        await axios
          .post("http://localhost:3000/api/user/change-password", {
            userId: this.$store.state.auth.id,
            password: this.changePassValidate.oldPassword,
            newPassword: this.changePassValidate.newPassword,
          })
          .then((res) => {
            if (res.status === 200) {
              resolve("PasswordChanged");
            } else {
              reject();
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              this.errors = err.response.data.message;
            } else {
              this.errors = "Something went wrong...";
            }
          });
      });
    },
    //validating if the password is equal to 6 or more char
    isValidPassword() {
      return this.changePassValidate.oldPassword == ""
        ? ""
        : this.changePassValidate.oldPassword.length >= 6 &&
          this.changePassValidate.newPassword.length >= 6 &&
          this.changePassValidate.newPassword2.length >= 6 &&
          this.changePassValidate.newPassword === this.changePassValidate.newPassword2
        ? true
        : false;
    },
    isPasswordMatching() {
      if (
        this.changePassValidate.newPassword === this.changePassValidate.newPassword2
      ) {
        return true;
      } else {
        return false;
      }
    },
    //popup - success pass change
    updatePassSuccess() {
      this.closePassDialog();
      this.$notify({
        title: "Password Updated",
        message: "Password was successfully updated!",
        type: "success",
      });
    },
    logout() {
      this.$store.commit("logOut");
      this.$cookies.remove("jwt");
      axios.defaults.headers.common["Authorization"] = null;
      this.$router.push("/login");
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
    closePassDialog() {
      this.changePassDialog = false;
      (this.changePassValidate.oldPassword = ""),
        (this.changePassValidate.newPassword = ""),
        (this.changePassValidate.newPassword2 = "");
    },
  },
};
</script>

<style lang="scss" scoped>
/* Shitty CSS for now */
.template {
  height: 100vh;
  background-color: #191a1f;

  .header {
    background-color: #121318 !important;
    box-shadow: 0 0 2px #8112ea;
    height: 50px;
  }
  .el-row--flex.is-align-middle {
    background-color: #191a1f;
  }
  .el-avatar {
    background: #8112ea;
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

.textTitle {
  color: #d0cae5;
}
h3 {
  color: white;
}
p {
  color: white;
  letter-spacing: 0.3px;
  font-weight: 500;
  word-break: break-all;
}

#completed {
  color: rgb(82, 231, 82);
  font-weight: 700;
}
#inProgress {
  color: yellow;
  font-weight: 700;
}
#dateCreated {
  font-size: 13px;
  color: white;
}
#linkProject {
  font-size: 16px;
}
.mt-1 {
  margin-top: 10px;
}
.mt-5 {
  margin-top: 70px;
}
.bold {
  font-weight: 700;
}
.moreDropdown {
  background-color: #121318 !important;
  border: none;
}
#passwordWarning {
  color: red;
  font-size: 12px;
}
.el-row--flex.is-justify-center {
  border-top: 1px solid #8112ea;
  background-color: #191a1f !important;
}
#projCompleted{
  color: white;
}
</style>
