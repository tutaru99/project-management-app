<template>
  <div>
    <!-- v-if acts as a loader otherwise data doesnt show -->
    <div class="board-layout" v-if="projectData">
      <div class="left">
        <div id="boardTitle" class="board-text">{{ projectData.title }}</div>
        <div>
          <!-- Invite User to project -->
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click="inviteUserDialog = true"
          >
            Invite users to collaborate
          </el-button>
          <span class="ml-3" id="totalTaskTime">
            Total Time: {{ addTime }}
            <el-button
              @click="viewPeopleDialog = true"
              type="primary"
              class="ml-5"
              closable
              >People</el-button
            >
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
      <div id="boardlists" class="board-lists">
        <!-- whole card holder -->
      <div
          class="board-list cardList"
          v-for="column in projectData.columns"
          :key="column.id"
        >
          <div class="list-title">
            <el-row type="flex" justify="space-between" align="middle">
              <h4>{{ column.col_name }}</h4>
                <el-col :span="4">
                  <el-dropdown  class="delete hide" placement="bottom-start" trigger="click">
                        <el-button
                          class="delete hide"
                          plain
                          icon="el-icon-more"
                          circle
                        ></el-button>
                          <template #dropdown>
                            <el-dropdown-menu >
                              <el-dropdown-item icon="el-icon-edit" @click="openEditColumnNameModalDialog(column)">Rename List</el-dropdown-item>
                              <el-dropdown-item icon="el-icon-plus" @click="openTaskModalDialog(column)">Add New Task</el-dropdown-item>
                              <el-dropdown-item icon="el-icon-delete" @click="deleteColumn(column._id)">Remove List</el-dropdown-item>
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
            @start="drag = true"
            @end="drag = false"
            item-key="task_name"
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
                <i :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
                  @click="element.fixed = !element.fixed"
                  aria-hidden="true"
                ></i>
                <div @click.self="openDetailsTaskDialog(element)">
                  {{ element.task_name }}
                </div>
                <div class="inline" @click.self="openDetailsTaskDialog(element)">
                  <div>
                    <el-button
                      class="details"
                      size="small"
                      icon="el-icon-edit"
                      circle
                      @click="openTaskDetailsModalDialog(element)"
                    ></el-button>
                  </div>
                </div>
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
    <el-dialog
      title="People in project"
      v-model="viewPeopleDialog"
      width="50%"
    >
      <PeopleInProjectDialog
        v-if="viewPeopleDialog"
        :users="projectData.users"
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
    this.getProject();
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
      this.projectData.columns.forEach((column) => {
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
      detailsTaskDialogDataReactive(task) {
      return task
    }
  },

  methods: {
    async getProject() {
      await axios
        .get(`http://localhost:3000/api/projects/${this.$route.params.id}`)
        .then((response) => {
          this.projectData = response.data;
        });
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
      await axios
        .post("http://localhost:3000/api/projects/add-user", {
          projectId: this.projectData._id,
          userEmail: this.email,
        })
        .then(async () => {
          this.inviteUserDialog = false;
          this.email = null;
          await this.getProject();
        });
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

#boardTitle {
  color: #fff;
}
.board-layout {
  background-color: rgb(0, 0, 0);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  display: grid;
  grid-template-rows: max-content auto;
  grid-gap: 10px;
  padding: 10px 10px;
  height: 97vh;
  width: 99%;
  overflow-y: auto !important;
}
.list-layout {
  display: grid;
  grid-gap: 10px;
}
.board-text {
  font-weight: bold;
  font-size: 28px;
  padding: 5px;
}
.board-lists {
  display: grid;
  grid-auto-columns: 275px;
  grid-auto-flow: column;
  grid-gap: 10px;
}
.board-list {
  background-color: rgb(235, 236, 240);
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
.list-title {
  font-size: 18px;
  font-weight: bold;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
  padding: 5px 0 5px 0;
}
.card {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  padding: 10px;
  cursor: pointer;
}

.cardList {
  max-height: 700px;
  overflow: auto;
}
.cardList:hover .hide  {
  display: block;
  margin-top: -26px;
}
.hide {
  display: none;
}

ul li:nth-child(n + 2) {
  margin-top: 10px;
}
.inline {
  margin-top: 5px;
  display: flex;
}
.colButton {
  max-height: 40px;
}
.delete {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  left: 84%;
  position: absolute;
}
.addNewTask {
  width: 100%;
  margin-bottom: 7px;
}
#totalTaskTime {
  color: white;
  font-weight: 600;
}




/* ScrollBar */
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgb(255, 255, 255) rgb(0, 0, 0);
}
/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 12px;
}
*::-webkit-scrollbar-track {
  background: rgb(0, 0, 0);
}
*::-webkit-scrollbar-thumb {
  background-color: rgb(255, 255, 255);
  border-radius: 20px;
  border: 2px solid rgb(0, 0, 0);
}
</style>