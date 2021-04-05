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
            > Add people to the project </el-button
          >
          <span class="ml-3" id="totalTaskTime">
            Total Time: {{ addTime }}
            <el-button @click="viewPeopleDialog = true" type="primary" class="ml-5" closable >People</el-button>
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
                <el-button @click="addUserToProject()" type="primary">Add user</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </div>
      <!-- whole board element -->
      <div id="boardlists" class="board-lists">
        <!-- whole card -->
        <div
          v-for="(column, colNo) in projectData.columns"
          :key="column.id"
          :id="`list${colNo}`"
          class="board-list cardList"
          @drop="dropIt($event)"
          @dragover="allowDrop($event)"
        >
        <div id="show" class="list-title" >
          <el-row type="flex" justify="space-between" align="middle">
            <h4>{{ column.col_name }}</h4>
            <el-button
              class="delete hide"
              type="danger"
              plain
              icon="el-icon-delete"
              @click="deleteColumn(column._id)"
              circle
            ></el-button>
          </el-row>
        </div>
        <!-- Card element -->
          <div
            v-for="(task, taskNo) in column.tasks"
            :key="task.id"
            :id="`card${taskNo}-${Math.random()}`"
            class="card"
            draggable="true"
            @dragstart="dragStart($event)"
            @click.self="openDetailsTaskDialog(task)"
          >
            <div @click="openDetailsTaskDialog(task)">
              <p>{{ task.task_name }}</p>
            </div>

            <div class="inline" @click.self="openDetailsTaskDialog(task)">
              <div>
                <el-button
                  class="details"
                  size="small"
                  icon="el-icon-edit"
                  circle
                  @click="openTaskDetailsModalDialog(task)"
                ></el-button>
              </div>

            </div>
          </div>
          <div>
            <el-button
              icon="el-icon-plus"
              type="primary" plain
              class="addNewTask"
              @click="openTaskModalDialog(column)">
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
          <el-form :model="col_nameValidateForm" ref="col_nameValidateForm" >
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
              <el-button type="primary" @click="validateColSubmit('col_nameValidateForm', projectData._id)"
                >Add List</el-button
              >
            </span>
          </template>
        </el-dialog>
      </div>
                      <h1>
                                          <h1>NEW CARD TEST</h1>
                                  <el-row>
                                    <div  class="ml-3 vueDraggable" v-for="column in projectData.columns"
                                            :key="column.id">
                                            <h1>{{column.col_name}}</h1>
                                          <draggable 
                                         
                                                  tag="transition-group"
                                                   :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }"
                                                    v-model="column.tasks" 
                                                    group="people" 
                                                    @start="drag=true" 
                                                    @end="drag=false" 
                                                    item-key="task_name">
                                            <template #item="{element}">
                                                     <li  class="list-group-item vueDraggable2">
                                                      <i
                                                        :class="
                                                          element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
                                                        "
                                                        @click="element.fixed = !element.fixed"
                                                        aria-hidden="true"
                                                      ></i>
                                                      {{ element.task_name}}
                                                    </li>
                                           
                                            </template>
                                        </draggable>
                                      </div>
                            </el-row>
                      </h1>
    </div>
    <!-- Dialog Components -->
    <NewTaskDialogComponent
      v-if="taskModalDialog"
      :taskModalDialog="taskModalDialog"
      :dialogData="taskDialogData"
      @create="getProject"
      @close="closeTaskModalDialog"
    />
    <TaskDetailsDialog
      v-if="editTaskModalDialog"
      :editTaskModalDialog="editTaskModalDialog"
      :editTaskDialogData="editTaskDialogData"
      @close="closeEditTaskModalDialog"
      @edit="getProject"
    />

    <DetailsTaskDialog
      v-if="detailsTaskDialog"
      :detailsTaskDialog="detailsTaskDialog"
      :detailsTaskDialogData="detailsTaskDialogData"
      @submit="getProject"
      @close="closeDetailsTaskDialog"
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
import TaskDetailsDialog from "@/components/Task/EditTaskDialog.vue";
import DetailsTaskDialog from "@/components/Task/DetailsTaskDialog.vue";
import PeopleInProjectDialog from "@/components/Task/PeopleInProjectDialog.vue";

import draggable from 'vuedraggable';

export default {
  components: {
    NewTaskDialogComponent,
    TaskDetailsDialog,
    DetailsTaskDialog,
    PeopleInProjectDialog,
    draggable
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

       drag: false
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
        ghostClass: "ghost"
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
      let hours = (total / 60);
      let rhours = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes = Math.round(minutes);
      return rhours + " hour(s) " + rminutes + " minute(s)";
    },
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

    async addUserToProject (){
      await axios.post('http://localhost:3000/api/projects/add-user', {
        projectId: this.projectData._id,
        userEmail: this.email
      }).then(async () => {
        this.inviteUserDialog = false
        this.email = null
        await this.getProject()
      })
    },

    allowDrop(ev) {
      ev.preventDefault(); // default is not to allow drop
    },
    dragStart(ev) {
      // The 'text/plain' is referring the Data Type (DOMString)
      // of the Object being dragged.
      // ev.target.id is the id of the Object being dragged
      ev.dataTransfer.setData("text/plain", ev.target.id);
    },
    dropIt(ev) {
      ev.preventDefault(); // default is not to allow drop
      let sourceId = ev.dataTransfer.getData("text/plain");
      let sourceIdEl = document.getElementById(sourceId);
      let sourceIdParentEl = sourceIdEl.parentElement;
      // ev.target.id here is the id of target Object of the drop
      let targetEl = document.getElementById(ev.target.id);
      let targetParentEl = targetEl.parentElement;

      // Compare List names to see if we are going between lists
      // or within the same list
      console.log(ev.target.id.substring(0, 4));
      if (
        targetParentEl.id !== sourceIdParentEl.id &&
        ev.target.id.substring(0, 4) != "card"
      ) {
        // If the source and destination have the same
        // className (card), then we risk dropping a Card in to a Card
        // That may be a cool feature, but not for us!
        if (targetEl.className === sourceIdEl.className) {
          // Append to parent Object (list), not to a
          // Card in the list
          // This is in case you drag and drop a Card on top
          // of a Card in a different list
          // targetParentEl.appendChild(sourceIdEl);
        } else {
          // Append to the list
          targetEl.appendChild(sourceIdEl);
        }
      }
      /* Temporary fix to remove bug when dropping cards on each other */

      /* else {
        // Same list. Swap the text of the two cards
        // Just like swapping the values in two variables
        // Temporary holder of the destination Object
        let holder = targetEl;
        // The text of the destination Object.
        // We are really just moving the text, not the Card
        let holderText = holder.textContent;
        // Replace the destination Objects text with the sources text
        targetEl.textContent = sourceIdEl.textContent;
        // Replace the sources text with the original destinations
        sourceIdEl.textContent = holderText;
        holderText = "";
      } */
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
.board-lists:last-child {
  margin-right: 15px;
}
.board-list {
  background-color: rgb(235, 236, 240);
  border-radius: 3px;
  display: grid;
  grid-auto-rows: max-content;
  grid-gap: 10px;
  /* Chrome use a fixed height */
  height: max-content;
  min-height: 140px;
  padding: 10px;
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

.addNewTask{
  width: 100%;
  margin-bottom: 7px;
}
.cardList {
  max-height: 700px;
  overflow: auto;
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
.delete {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  left: 84%;
  position: absolute;
}
.hide {
  display: none;
}
.cardList:hover .hide {
     display: block;
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

#totalTaskTime {
  color: white;
  font-weight: 600;
}



/* CARD LIB CSS */
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
.vueDraggable{
  background-color: grey;
}
.vueDraggable2{
  background-color: white;
}

</style>