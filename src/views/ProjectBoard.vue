<template>
  <div class="template" id="bodyBoard">
    <!-- v-if acts as a loader otherwise data doesnt show -->
    <el-row
      v-if="loading"
      type="flex"
      justify="center"
      align="middle"
      style="height: 95vh"
    >
      <breeding-rhombus-spinner
        :animation-duration="2000"
        :size="65"
        color="#8112ea"
      />
    </el-row>
    <div class="board-layout" v-else v-dragscroll.x>
      <div class="left" data-no-dragscroll>
        <div id="boardTitle" class="board-text ml-05" data-no-dragscroll>
          <el-row type="flex" align="middle" data-no-dragscroll>
            {{ projectData.title }}
            <el-button
              v-if="projectRoleOwner === true"
              @click="openUpdateProjDialog()"
              class="ml-05"
              size="mini"
              icon="el-icon-edit"
              circle
              data-no-dragscroll
            ></el-button>
          </el-row>
        </div>
        <div data-no-dragscroll>
          <!-- Invite User to project -->
          <el-button
            class="ml-05"
            icon="el-icon-plus"
            type="primary"
            @click="inviteUserDialog = true"
            data-no-dragscroll
          >
            Invite
          </el-button>
          <el-button
            icon="el-icon-user"
            @click="viewPeopleDialog = true"
            type="primary"
            class="ml-5"
            closable
            data-no-dragscroll
            >Members</el-button
          >
          <span class="ml-7" id="totalTaskTime" data-no-dragscroll>
            Total Time: {{ addTime }}
          </span>
          <div data-no-dragscroll></div>
        </div>
      </div>
      <!-- whole board element -->
      <div class="board-lists">
        <!-- whole card holder -->
        <div
          class="board-list cardList grabbable"
          v-for="column in projectData.columns"
          :key="column.id"
        >
          <div class="list-title">
            <el-row type="flex" justify="space-between" align="middle">
              <span class="columnName">
                {{ column.col_name }}
                <el-badge :value="column.tasks.length" />
              </span>
              <el-col :span="2">
                <el-dropdown
                  class="delete hide"
                  placement="bottom-start"
                  trigger="click"
                >
                  <el-button
                    class="delete hide"
                    plain
                    icon="el-icon-more"
                    size="mini"
                    circle
                    data-no-dragscroll
                  ></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        icon="el-icon-edit"
                        @click="openEditColumnNameModalDialog(column)"
                        >Rename List</el-dropdown-item
                      >
                      <el-dropdown-item
                        icon="el-icon-plus"
                        @click="openTaskModalDialog(column)"
                        >Add New Task</el-dropdown-item
                      >
                      <el-dropdown-item
                        icon="el-icon-delete"
                        @click="deleteColumn(column._id)"
                        >Remove List</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
          <draggable
            tag="transition-group"
            :component-data="{
              tag: 'ul',
              name: 'flip-list',
              type: 'transition',
            }"
            v-model="column.tasks"
            group="people"
            item-key="task_name"
            @start="drag = true"
            @end="drag = false"
            @change="
              ($e) => {
                moveTask(column._id, $e);
              }
            "
            data-no-dragscroll
          >
            <template #item="{ element }" data-no-dragscroll>
              <li
                @click="openDetailsTaskDialog(element)"
                class="list-group-item card"
                data-no-dragscroll
              >
                <DetailsTaskDialog
                  v-if="detailsTaskDialogData._id == element._id"
                  :detailsTaskDialog="true"
                  :detailsTaskDialogData="element"
                  :projectOwner="projectData.owner"
                  :users="projectData.users"
                  @submit="getProject"
                  @close="closeDetailsTaskDialog"
                  data-no-dragscroll
                />
                <i
                  :class="
                    element.fixed
                      ? 'fa fa-anchor'
                      : 'glyphicon glyphicon-pushpin'
                  "
                  @click="element.fixed = !element.fixed"
                  aria-hidden="true"
                  data-no-dragscroll
                ></i>
                <div
                  @click.self="openDetailsTaskDialog(element)"
                  data-no-dragscroll
                >
                  <p id="taskName" data-no-dragscroll>
                    {{ element.task_name }}
                  </p>
                </div>
                <el-row
                  class="mt-1"
                  type="flex"
                  @click="openDetailsTaskDialog(element)"
                  data-no-dragscroll
                >
                  <el-col :span="24" data-no-dragscroll>
                    <el-row type="flex" justify="start" data-no-dragscroll>
                      <el-button
                        class="details mt-05"
                        size="mini"
                        icon="el-icon-edit"
                        circle
                        @click.stop="openTaskDetailsModalDialog(element)"
                        data-no-dragscroll
                      ></el-button>

                      <div
                        v-if="element.task_description"
                        class="mt-05 flag pl-1"
                        data-no-dragscroll
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="Task Description"
                          placement="top"
                          data-no-dragscroll
                        >
                          <i
                            style="color: white"
                            class="mdi mdi-chat-alert-outline"
                            data-no-dragscroll
                          ></i>
                        </el-tooltip>
                      </div>
                      <!-- Task State -->
                      <div
                        v-if="element.task_state === 'On Hold'"
                        class="mt-05 flag pl-1"
                        data-no-dragscroll
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="element.task_state"
                          placement="top"
                        >
                          <i
                            class="mdi mdi-pause-circle-outline"
                            style="color: yellow"
                            data-no-dragscroll
                          ></i>
                        </el-tooltip>
                      </div>

                      <div
                        v-if="element.task_state === 'In Progress'"
                        class="mt-05 flag pl-1"
                        data-no-dragscroll
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="element.task_state"
                          placement="top"
                        >
                          <i
                            class="mdi mdi-progress-clock"
                            style="color: white"
                            data-no-dragscroll
                          ></i>
                        </el-tooltip>
                      </div>

                      <div
                        v-if="element.task_state === 'Completed'"
                        class="mt-05 flag pl-1"
                        data-no-dragscroll
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="element.task_state"
                          placement="top"
                        >
                          <i
                            class="mdi mdi-progress-check"
                            style="color: green"
                            data-no-dragscroll
                          ></i>
                        </el-tooltip>
                      </div>
                      <div
                        v-if="element.task_priority"
                        class="mt-05 flag pl-1"
                        data-no-dragscroll
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="taskFlagTooltopText(element.task_priority)"
                          placement="top"
                        >
                          <i
                            class="mdi mdi-flag"
                            :style="taskFlagColor(element.task_priority)"
                            data-no-dragscroll
                          ></i>
                        </el-tooltip>
                      </div>
                    </el-row>
                  </el-col>
                  <el-col :span="24" data-no-dragscroll>
                    <el-row type="flex" justify="end" data-no-dragscroll>
                      <div
                        v-if="usersAddedToTask(element).length > 0"
                        style="text-align: right"
                        data-no-dragscroll
                      >
                        <span
                          v-for="user in usersAddedToTask(element)"
                          :key="user.id"
                          data-no-dragscroll
                        >
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="user.username"
                            placement="top"
                          >
                            <el-avatar size="small" data-no-dragscroll>
                              {{ user.username.charAt(0).toUpperCase() }}
                            </el-avatar>
                          </el-tooltip>
                        </span>
                      </div>
                    </el-row>
                  </el-col>
                </el-row>
              </li>
            </template>
          </draggable>
          <div data-no-dragscroll>
            <el-button
              icon="el-icon-plus"
              type="primary"
              plain
              class="addNewTask"
              @click="openTaskModalDialog(column)"
              data-no-dragscroll
            >
              <span data-no-dragscroll>New Task</span>
            </el-button>
          </div>
        </div>
        <el-button
          class="colButton"
          icon="el-icon-plus"
          type="primary"
          outlined
          @click="colDialogFormVisible = true"
          data-no-dragscroll
          >NEW LIST</el-button
        >
      </div>
    </div>
  </div>
  <!-- Dialog Components -->
  <NewTaskDialogComponent
    v-if="taskModalDialog"
    :taskModalDialog="taskModalDialog"
    :dialogData="taskDialogData"
    @create="getProject"
    @close="closeTaskModalDialog"
  />
  <EditColumnNameDialog
    v-if="editColumnNameModalDialog"
    :editColumnNameModalDialog="editColumnNameModalDialog"
    :editColumnNameModalDialogData="editColumnNameModalDialogData"
    @create="getProject"
    @close="closeEditColumnNameModalDialog"
  />
  <TaskDetailsDialog
    v-if="editTaskModalDialog"
    :editTaskModalDialog="editTaskModalDialog"
    :editTaskDialogData="editTaskDialogData"
    @close="closeEditTaskModalDialog"
    @edit="getProject"
  />
  <el-dialog title="Invited Members" v-model="viewPeopleDialog" width="50%">
    <PeopleInProjectDialog
      v-if="viewPeopleDialog"
      :users="projectData.users"
      :usersRoles="projectUserRoles"
      :currentUserRole="userRole()"
      :projectId="projectData._id"
      @removed="getProject"
      @close="viewPeopleDialog = false"
    />
  </el-dialog>
  <!-- Change Project's name and descr Dialog -->
  <el-dialog
    title="Update Project Information"
    v-model="updateProjectDialog"
    width="30%"
    data-no-dragscroll
  >
    <el-form
      :model="updateProjectValidate"
      ref="updateProjectValidate"
      data-no-dragscroll
    >
      <el-form-item
        label="Project Name"
        prop="title"
        :rules="[{ required: true, message: 'Project name is required' }]"
        data-no-dragscroll
      >
        <el-input
          maxlength="40"
          show-word-limit
          v-model="updateProjectValidate.title"
          autocomplete="off"
          data-no-dragscroll
        ></el-input>
      </el-form-item>
      <el-form-item label="Short Description" data-no-dragscroll>
        <el-input
          type="textarea"
          maxlength="200"
          minlength="1"
          :rows="5"
          show-word-limit
          v-model="updateProjectValidate.description"
          autocomplete="off"
          data-no-dragscroll
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer data-no-dragscroll>
      <span class="dialog-footer" data-no-dragscroll>
        <el-button @click="updateProjectDialog = false" data-no-dragscroll
          >Cancel</el-button
        >
        <el-button
          type="primary"
          @click="
            validateProjectUpdate('updateProjectValidate', projectData._id)
          "
          data-no-dragscroll
          >Update</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- Invite user to project dialog -->
  <el-dialog
    :before-close="closeInviteUserDialog"
    title="Invite User to Join the Project"
    v-model="inviteUserDialog"
    width="30%"
    data-no-dragscroll
  >
    <el-form ref="inviteForm" data-no-dragscroll>
      <el-form-item label="Email" data-no-dragscroll>
        <el-input
          v-model="email"
          autocomplete="off"
          data-no-dragscroll
        ></el-input>
      </el-form-item>
      <p class="pb-2 has-text-danger" data-no-dragscroll>
        {{ inviteErrors }}
      </p>
    </el-form>
    <template #footer data-no-dragscroll>
      <span class="dialog-footer" data-no-dragscroll>
        <el-button @click="closeInviteUserDialog()" data-no-dragscroll
          >Cancel</el-button
        >
        <el-button @click="addUserToProject()" type="primary" data-no-dragscroll
          >Add user</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- New List/column dialog -->
  <el-dialog
    :before-close="closeColDialog"
    title="New List"
    v-model="colDialogFormVisible"
    width="30%"
  >
    <el-form :model="col_nameValidateForm" ref="col_nameValidateForm">
      <el-form-item
        label="List name"
        prop="col_name"
        :rules="[{ required: true, message: 'List name is required' }]"
      >
        <el-input
          v-model="col_nameValidateForm.col_name"
          maxlength="70"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeColDialog()">Cancel</el-button>
        <el-button
          type="primary"
          @click="validateColSubmit('col_nameValidateForm', projectData._id)"
          >Add List</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
import NewTaskDialogComponent from "@/components/Task/NewTaskDialog.vue";
import EditColumnNameDialog from "@/components/Column/EditColumnNameDialog.vue";
import TaskDetailsDialog from "@/components/Task/EditTaskDialog.vue";
import DetailsTaskDialog from "@/components/Task/DetailsTaskDialog.vue";
import PeopleInProjectDialog from "@/components/Task/PeopleInProjectDialog.vue";
import { BreedingRhombusSpinner } from "epic-spinners";

import draggable from "vuedraggable";

export default {
  components: {
    NewTaskDialogComponent,
    EditColumnNameDialog,
    TaskDetailsDialog,
    DetailsTaskDialog,
    PeopleInProjectDialog,
    draggable,
    BreedingRhombusSpinner,
  },
  data() {
    return {
      updateProjectDialog: false,
      projectRoleOwner: null,
      updateProjectValidate: {
        title: "",
        description: "",
      },

      inviteUserDialog: false,
      email: "",

      projectData: {},
      loading: false,
      visible: false,
      taskid: "",
      taskModalDialog: false,
      taskDialogData: {},

      editTaskModalDialog: false,
      editTaskDialogData: {},

      editColumnNameModalDialog: false,
      editColumnNameModalDialogData: {},

      colID: "",
      projectID: "",
      colDialogFormVisible: false,
      col_nameValidateForm: {
        col_name: "",
      },

      detailsTaskDialogData: {},
      detailsTaskDialog: false,
      viewPeopleDialog: false,

      routeID: this.$route.params.id,

      drag: false,
      inviteErrors: null,
      ownerObj: null,
    };
  },
  beforeMount() {
    /* checks whether dark or light theme is selected by the user */
    if (this.$store.state.darkMode === false) {
      this.light();
    } else {
      this.dark();
    }
  },
  created() {
    this.loading = true;
    this.getProject().then(() => {
      this.getOwner();
      this.userRole();
      setTimeout(() => (this.loading = false), 2000);
    });
  },

  watch: {
    $routeID() {
      this.getProject();
    },
    $route(to, from) {
      if (to.path != from.path && to.path.includes("projectboard")) {
        this.getProject();
      }
    },
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    addTime() {
      if (this.projectData.columns) {
        let total = 0;
        for (const column of this.projectData.columns) {
          for (const task of column.tasks) {
            if (task.task_time != null) {
              total += task.task_time;
            }
          }
        }
        let hours = total / 60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);

        if (rhours > 0 || rminutes > 0) {
          return rhours + " hour(s) " + rminutes + " minute(s)";
        } else {
          return "No Estimations";
        }
      }
    },
    detailsTaskDialogDataReactive(task) {
      return task;
    },
    projectUserRoles() {
      let roles = {
        users: [],
        owner: {},
      };
      if (this.projectData) {
        this.projectData.userRoles.forEach((role) => {
          roles.users.push(role);
        });
        roles.owner = this.projectData.owner;
      }
      return roles;
    },
  },

  methods: {
    /* Change to Light theme + emmit */
    light() {
      document.querySelector("body").classList.remove("dark-mode");
    },
    /* Change to Dark theme + emmit */
    dark() {
      document.querySelector("body").classList.add("dark-mode");
    },
    getOwner() {
      axios
        .post(`${process.env.VUE_APP_BASE_URL_API}/api/user/info`, [
          this.projectData.owner[0],
        ])
        .then((res) => {
          this.ownerObj = {
            id: res.data[0].id,
            username: res.data[0].username,
            email: res.data[0].email,
            isOwner: true,
          };
        });
    },
    openUpdateProjDialog() {
      (this.updateProjectDialog = true),
        (this.updateProjectValidate.title = this.projectData.title);
      this.updateProjectValidate.description = this.projectData.description;
    },

    //Update Project Information
    async updateProjectInfo(projectID) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/${projectID}?userId=${this.$store.state.auth.id}`,
          {
            title: this.updateProjectValidate.title,
            description: this.updateProjectValidate.description,
          }
        )
        .then(() => {
          this.closeUpdateProjDialog(),
            this.getProject(),
            this.$notify({
              title: "Project Updated",
              type: "success",
            });
        })
        .catch((err) => {
          this.$notify({
            title: "Project failed to update",
            type: "error",
          });
        });
    },
    //Validate Project Input field
    validateProjectUpdate(formName, projectID) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateProjectInfo(projectID);
        } else {
          return false;
        }
      });
    },

    usersAddedToTask: function(element) {
      const arr = [];
      element.asignee.forEach((asignee) => {
        const filteredArr = this.projectData.users.filter(function(user) {
          return user.id === asignee;
        });
        if (filteredArr.length) {
          arr.push(filteredArr[0]);
        }
        if (this.projectData.owner[0] === asignee && this.ownerObj != null) {
          arr.push(this.ownerObj);
        }
      });
      return arr;
    },
    async getProject() {
      await axios
        .get(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/${this.$route.params.id}?userId=${this.$store.state.auth.id}`
        )
        .then((response) => {
          this.projectData = response.data;
        });
    },

    userRole() {
      const userId = this.$store.state.auth.id;
      const projectOwner = this.projectData.owner[0];

      if (projectOwner === userId) {
        this.projectRoleOwner = true;
        return "OWNER";
      } else {
        this.projectRoleOwner = false;
        if (this.projectData.users.find((user) => user.id === userId)) {
          return this.projectData.userRoles.find((el) => el.userId == userId)
            .role;
        } else {
          this.projectRoleOwner = false;
          this.$router.push("/");
        }
      }
    },

    async removeTask(taskid) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/deletetask/${taskid}`
        )
        .then((response) => {
          (this.tasks = response.data), this.getProject();
        });
    },

    async deleteColumn(colID) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/deletecolumn/${colID}?user=${this.$store.state.auth.id}&project=${this.projectData._id}`
        )
        .then((response) => {
          (this.tasks = response.data),
            this.$notify({
              title: "List Removed",
              message: "List has been removed!",
              type: "success",
            });
          this.getProject();
        });
    },

    validateColSubmit(formName, projectID) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addNewColumn(projectID);
        } else {
          return false;
        }
      });
    },

    async addNewColumn(projectID) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/addcolumn/${projectID}`,
          {
            col_name: this.col_nameValidateForm.col_name,
            userId: this.$store.state.auth.id,
          }
        )
        .then((response) => {
          (this.tasks = response.data),
            this.$notify({
              title: "List Created",
              message: "List successfully created!",
              type: "success",
            });
          this.getProject(), this.closeColDialog();
        });
    },

    async addUserToProject() {
      const role = this.userRole();
      await axios
        .post(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/add-user`,
          {
            projectId: this.projectData._id,
            userEmail: this.email,
          },
          {
            headers: {
              role: role,
            },
          }
        )
        .then(async () => {
          this.inviteUserDialog = false;
          this.email = null;
          this.$notify({
            title: "Member Invited",
            message: "New Member has been invited to the project!",
            type: "success",
          });
          await this.getProject();
        })
        .catch((err) => {
          if (err.response.data.message) {
            this.inviteErrors = err.response.data.message;
          }
        });
    },

    async moveTask(columnId, event) {
      var projectTasks;
      for (const column of this.projectData.columns) {
        if (column._id === columnId) {
          projectTasks = column.tasks;
        }
      }
      if (event.moved) {
        await axios.put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/movetasksamecolumn/${columnId}`,
          {
            projectId: this.projectData._id,
            tasks: projectTasks,
            userId: this.$store.state.auth.id,
          }
        );
      }
      if (event.added) {
        await axios.put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/movetask/${event.added.element._id}/${columnId}`,
          {
            projectId: this.projectData._id,
            tasks: projectTasks,
            userId: this.$store.state.auth.id,
          }
        );
      }
    },

    taskFlagColor(taskPriority) {
      switch (taskPriority) {
        case "Option1":
          return "color:white";
          break;
        case "Option2":
          return "color:yellow";
          break;
        case "Option3":
          return "color:orange";
          break;
        case "Option4":
          return "color:red";
          break;
      }
    },

    taskFlagTooltopText(taskPriority) {
      switch (taskPriority) {
        case "Option1":
          return "Low priority";
          break;
        case "Option2":
          return "Medium priority";
          break;
        case "Option3":
          return "High priority";
          break;
        case "Option4":
          return "Very high priority";
          break;
      }
    },

    //Opening and closing component dialogs
    openTaskModalDialog(column) {
      this.taskDialogData = column;
      this.taskModalDialog = true;
    },
    closeTaskModalDialog() {
      this.taskDialogData = false;
      this.taskModalDialog = false;
      document.body.classList.remove("el-popup-parent--hidden");
    },

    openEditColumnNameModalDialog(column) {
      this.editColumnNameModalDialogData = column;
      this.editColumnNameModalDialog = true;
    },
    closeEditColumnNameModalDialog() {
      this.editColumnNameModalDialogData = false;
      this.editColumnNameModalDialog = false;
      document.body.classList.remove("el-popup-parent--hidden");
    },

    openTaskDetailsModalDialog(task) {
      this.editTaskDialogData = task;
      this.editTaskModalDialog = true;
    },
    closeEditTaskModalDialog() {
      this.editTaskDialogData = false;
      this.editTaskModalDialog = false;
      document.body.classList.remove("el-popup-parent--hidden");
    },

    openDetailsTaskDialog(task) {
      this.detailsTaskDialogData = task;
      this.detailsTaskDialog = true;
    },
    closeDetailsTaskDialog() {
      this.detailsTaskDialogData = false;
      this.detailsTaskDialog = false;
      document.body.classList.remove("el-popup-parent--hidden");
    },

    closeColDialog() {
      (this.colDialogFormVisible = !this.colDialogFormVisible),
        (this.col_nameValidateForm.col_name = "");
    },

    closeInviteUserDialog() {
      (this.inviteUserDialog = !this.inviteUserDialog), (this.username = "");
    },

    closeUpdateProjDialog() {
      (this.updateProjectDialog = !this.updateProjectDialog),
        (this.updateProjectValidate.title = ""),
        (this.updateProjectValidate.description = ""),
        this.getProject();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/scss/_variables.scss";

.template {
  height: 100vh;
  background-color: #191a1f;
  #boardTitle {
    padding: 0 0 5px 0;
  }
}

.board-layout {
  height: 97vh;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  display: grid;
  grid-template-rows: max-content auto;
  grid-gap: 10px;
  padding: 10px 10px;
  overflow-y: auto !important;

  #totalTaskTime {
    font-weight: 600;
  }
  .board-text {
    font-weight: bold;
    font-size: 28px;
    padding: 5px;
  }
  .grabbable {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
  }
  .grabbable:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }

  .board-list {
    border-radius: 3px;
    display: grid;
    grid-auto-rows: max-content;
    grid-gap: 10px;
    /* Chrome use a fixed height */
    height: 80vh;
    padding: 3px;
  }
  .board-lists:last-child {
    margin-right: 15px;
  }
}

.card {
  border-radius: 7px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 0 2px #8112ea;
  #taskName {
    font-size: 14px;
    font-weight: 600;
    word-break: break-all;
  }
  .flag {
    margin-top: 11px;
  }
  .el-avatar {
    margin-top: 7px;
    background: #8212eaad;
    width: 24px;
    margin-right: 4px;
    height: 24px;
    line-height: 25px;
    cursor: context-menu;
    font-weight: 500;
  }
}

.board-lists {
  display: grid;
  grid-auto-columns: 315px;
  grid-auto-flow: column;
  grid-gap: 10px;
  .cardList {
    max-height: 700px;
    overflow: auto;
    overflow-y: scroll;
  }
  /* Position of Column "More" button */
  .cardList:hover .hide {
    display: block;
    margin-top: -21px !important;
  }
  .list-title {
    padding: 10px 10px !important;
    border-radius: 3px;
    border-top: 1px solid #8112ea;
    box-shadow: 0 1px 3px #8112ea;
    font-size: 15px;
    font-weight: bold;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently */
    padding: 5px 0 5px 0;

    .hide {
      display: none;
    }
    .delete {
      position: -webkit-sticky; /* Safari */
      position: sticky;
      position: absolute;
    }
  }
}

ul li:nth-child(n + 2) {
  margin-top: 10px;
}
.colButton {
  max-height: 40px;
  margin-top: 5px;
}
.addNewTask {
  width: 100%;
  margin-bottom: 7px;
}
</style>
