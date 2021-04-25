<template>
  <div class="template">
    <!-- v-if acts as a loader otherwise data doesnt show -->
    <div class="board-layout" v-if="projectData">
      <div class="left">
        <div id="boardTitle" class="board-text ml-1">{{ projectData.title }}</div>
        <div>
          <!-- Invite User to project -->
          <el-button
          class="ml-1"
            icon="el-icon-plus"
            type="primary"
            @click="inviteUserDialog = true"
          >
            Invite
          </el-button>
            <el-button
              icon="el-icon-user"
              @click="viewPeopleDialog = true"
              type="primary"
              class="ml-5"
              closable
              >Members</el-button>
          <span class="ml-7" id="totalTaskTime">
            Total Time: {{ addTime }}
          </span>
          <el-dialog
            :before-close="closeInviteUserDialog"
            title="Invite User to Join the Project"
            v-model="inviteUserDialog"
            width="30%"
          >
            <el-form>
              <el-form-item label="Email">
                <el-input v-model="email" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="closeInviteUserDialog()">Cancel</el-button>
                <el-button @click="addUserToProject()" type="primary"
                  >Add user</el-button
                >
              </span>
            </template>
          </el-dialog>
        </div>
      </div>
      <!-- whole board element -->
      <div class="board-lists">
        <!-- whole card holder -->
        <div
          class="board-list cardList"
          v-for="column in projectData.columns"
          :key="column.id"
        >
          <div class="list-title">
            <el-row type="flex" justify="space-between" align="middle">
              <span class="columnName">{{ column.col_name }}</span>
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
          >
            <template #item="{ element }">
              <li class="list-group-item card">
                <DetailsTaskDialog
                  v-if="detailsTaskDialogData._id == element._id"
                  :detailsTaskDialog="true"
                  :detailsTaskDialogData="element"
                  :users="projectData.users"
                  @submit="getProject"
                  @close="closeDetailsTaskDialog"
                />
                <i
                  :class="
                    element.fixed
                      ? 'fa fa-anchor'
                      : 'glyphicon glyphicon-pushpin'
                  "
                  @click="element.fixed = !element.fixed"
                  aria-hidden="true"
                ></i>
                <div @click.self="openDetailsTaskDialog(element)">
                  <p id="taskName"> {{ element.task_name }} </p>
                </div>
                <el-row
                  class="mt-1"
                  type="flex"
                  @click="openDetailsTaskDialog(element)"
                >
                  <el-col :span="4">
                    <div>
                      <el-button
                        class="details mt-05"
                        size="mini"
                        icon="el-icon-edit"
                        circle
                        @click.stop="openTaskDetailsModalDialog(element)"
                      ></el-button>
                    </div>
                  </el-col>
                  <el-col :span="20">
                    <div style="text-align: right">
                      <span
                        v-for="user in usersAddedToTask(element)"
                        :key="user.id"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="user.username"
                          placement="top"
                        >
                          <el-avatar size="smmall">
                            {{ user.username.charAt(0).toUpperCase() }}
                          </el-avatar>
                        </el-tooltip>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </li>
            </template>
          </draggable>
          <div>
            <el-button
              icon="el-icon-plus"
              type="primary"
              plain
              class="addNewTask"
              @click="openTaskModalDialog(column)"
            >
              New Task
            </el-button>
          </div>
        </div>
        <el-button
          class="colButton"
          icon="el-icon-plus"
          type="primary"
          outlined
          @click="colDialogFormVisible = true"
          >NEW LIST</el-button
        >
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
                @click="
                  validateColSubmit('col_nameValidateForm', projectData._id)
                "
                >Add List</el-button
              >
            </span>
          </template>
        </el-dialog>
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
    <el-dialog title="People in project" v-model="viewPeopleDialog" width="50%">
      <PeopleInProjectDialog
        v-if="viewPeopleDialog"
        :users="projectData.users"
        :usersRoles="projectData.userRoles"
        :currentUserRole="userRole()"
        :projectId="projectData._id"
        @removed="getProject"
        @close="viewPeopleDialog = false"
      />
    </el-dialog>
  </div>
</template>


<script>
import axios from "axios";
import NewTaskDialogComponent from "@/components/Task/NewTaskDialog.vue";
import EditColumnNameDialog from "@/components/Column/EditColumnNameDialog.vue";
import TaskDetailsDialog from "@/components/Task/EditTaskDialog.vue";
import DetailsTaskDialog from "@/components/Task/DetailsTaskDialog.vue";
import PeopleInProjectDialog from "@/components/Task/PeopleInProjectDialog.vue";

import draggable from "vuedraggable";

export default {
  components: {
    NewTaskDialogComponent,
    EditColumnNameDialog,
    TaskDetailsDialog,
    DetailsTaskDialog,
    PeopleInProjectDialog,
    draggable,
  },
  data() {
    return {
      inviteUserDialog: false,
      email: "",

      projectData: null,
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
    };
  },

  mounted() {
    this.getProject().then(() => {
      this.userRole();
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
      let total = 0;

      // if(this.projectData.columns) {
      for (const column of this.projectData.columns) {
        for (const task of column.tasks) {
          if (task.task_time != null) {
            total += task.task_time;
          }
        }
      }
      // }

      let hours = total / 60;
      let rhours = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes = Math.round(minutes);
      return rhours + " hour(s) " + rminutes + " minute(s)";
    },
    detailsTaskDialogDataReactive(task) {
      return task;
    },
  },

  methods: {
    usersAddedToTask: function (element) {
      let arr = [];
      element.asignee.forEach((asignee) => {
        const filteredArr = this.projectData.users.filter(function (user) {
          return user.id === asignee;
        });
        arr.push(filteredArr[0]);
      });
      return arr;
    },
    async getProject() {
      await axios
        .get(`http://localhost:3000/api/projects/${this.$route.params.id}`)
        .then((response) => {
          this.projectData = response.data;
        });
    },

    userRole() {
      const userId = this.$store.state.auth.id;
      const projectOwner = this.projectData.owner[0];

      if (projectOwner === userId) {
        return "OWNER";
      } else {
        if (this.projectData.users.find((user) => user.id === userId)) {
          return this.projectData.userRoles.find((el) => el.userId == userId)
            .role;
        } else {
          this.$router.push("/");
        }
      }
    },

    async removeTask(taskid) {
      await axios
        .put(`http://localhost:3000/api/projects/deletetask/${taskid}`)
        .then((response) => {
          (this.tasks = response.data), this.getProject();
        });
    },

    async deleteColumn(colID) {
      await axios
        .put(`http://localhost:3000/api/projects/deletecolumn/${colID}`)
        .then((response) => {
          (this.tasks = response.data), this.getProject();
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
        .put(`http://localhost:3000/api/projects/addcolumn/${projectID}`, {
          col_name: this.col_nameValidateForm.col_name,
        })
        .then((response) => {
          (this.tasks = response.data),
            this.getProject(),
            this.closeColDialog();
        });
    },

    async addUserToProject() {
      const role = this.userRole();
      await axios
        .post(
          "http://localhost:3000/api/projects/add-user",
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
          await this.getProject();
        });
    },

    async moveTask(columnId, event) {
      console.log(event);
      if (event.moved) {
        var projectTasks;
        for (const column of this.projectData.columns) {
          console.log(column);
          if (column._id === columnId) {
            projectTasks = column.tasks;
          }
        }
        await axios.put(
          `http://localhost:3000/api/projects/movetasksamecolumn/${columnId}`,
          {
            projectId: this.projectData._id,
            tasks: projectTasks,
          }
        );
      }
      if (event.added) {
        console.log(event.added.element._id, columnId);
        await axios
          .put(
            `http://localhost:3000/api/projects/movetask/${event.added.element._id}/${columnId}`
          )
          .then((response) => {
            (this.projectData = response.data), this.getProject();
          });
      }
    },

    moveTaskSameColumn(event) {
      console.log(event);
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
  },
};
</script>

<style lang="scss" scoped>
@import "src/scss/_variables.scss";

.template {
    height: 100vh;
    background-color: #191A1F;

    #boardTitle {
    color: #fff;
    }
}

.board-layout {
  height: 97vh;
  background-color: #191A1F;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  display: grid;
  grid-template-rows: max-content auto;
  grid-gap: 10px;
  padding: 10px 10px;
  overflow-y: auto !important;

    #totalTaskTime {
      color: white;
      font-weight: 600;
    }
    .board-text {
      font-weight: bold;
      font-size: 28px;
      padding: 5px;
    }
    .board-list {
      border-radius: 3px;
      display: grid;
      grid-auto-rows: max-content;
      grid-gap: 10px;
      /* Chrome use a fixed height */
      height: max-content;
      padding: 10px;
    }
    .board-lists:last-child {
      margin-right: 15px;
    }

}

.card {
  background-color: #121318;
  border-radius: 7px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  padding: 10px;
  cursor: grab;
  box-shadow: 0 0 2px #8112EA;

    #taskName{
      font-size: 14px;
      font-weight: 600;
      color: #D0CAE5;
  }
    .el-avatar {
      margin-top: 7px;
      background: rebeccapurple;
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
  grid-auto-columns: 305px;
  grid-auto-flow: column;
  grid-gap: 10px;

    .cardList {
      max-height: 700px;
      overflow: auto;
    }
    /* Position of Column "More" button */
    .cardList:hover .hide {
      display: block;
      margin-top: -21px;
    }

    .list-title {
      padding: 10px 10px !important;
      background-color: #121318;
      border-radius: 3px;
      border-top: 1px solid #8112EA;
      box-shadow: 0 0 3px #8112EA;
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
        .columnName {
          color: #D0CAE5;
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
  margin-top: 10px;
}
.addNewTask {
  width: 100%;
  margin-bottom: 7px;
}
* {
  /* ScrollBar */
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #D0CAE5 #191A1F;
    /* Chrome, Edge, and Safari */
    *::-webkit-scrollbar {
      width: 12px;
    }
    *::-webkit-scrollbar-track {
      background: #191A1F;
    }
    *::-webkit-scrollbar-thumb {
      background-color: #D0CAE5;
      border-radius: 20px;
      border: 5px solid #191A1F;
    }
}
</style>