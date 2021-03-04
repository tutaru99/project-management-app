<template>
  <div>
    <!-- v-if acts as a loader otherwise data doesnt show -->
    <div class="board-layout" v-if="projectData">
      <div class="left">
        <div id="boardTitle" class="board-text">{{ projectData.title }}</div>
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
          <div class="list-title">
            {{ column.col_name }} - {{ column._id }}
            <el-button
              icon="el-icon-plus"
              circle
              @click="openTaskModalDialog(column)"
            ></el-button>
            <el-popover
              placement="right"
              :width="200"
              v-model:visible="visible.active"
            >
              <ul>
                <li>
                  <el-button
                    class="actionButtons"
                    type="success"
                    icon="el-icon-plus"
                    plain
                    @click="visible = false"
                    >Add Column</el-button
                  >
                </li>
                <li>
                  <el-button
                    class="actionButtons"
                    type="danger"
                    icon="el-icon-delete"
                    plain
                    @click="visible = false"
                    >Delete Column</el-button
                  >
                </li>
              </ul>

              <template #reference>
                <el-button
                  class="more-actions"
                  size="small"
                  icon="el-icon-more"
                  circle
                  @click="visible = true"
                ></el-button>
              </template>
            </el-popover>
          </div>

          <div
            v-for="(task, taskNo) in column.tasks"
            :key="task.id"
            :id="`card${taskNo}-${Math.random()}`"
            class="card"
            draggable="true"
            @dragstart="dragStart($event)"
          >
            {{ task.task_name }} ||
            {{ task.task_description }}
            <el-button
              class="more-actions"
              size="small"
              icon="el-icon-delete"
              circle
              @click="() => removeTask(task._id)"
            ></el-button>
          </div>
        </div>
      </div>
    </div>
  <NewTaskDialogComponent
  v-if="taskModalDialog"
  :taskModalDialog="taskModalDialog"
  :dialogData="taskDialogData"
  @create="getProject"
  @close="closeTaskModalDialog"
  />
  </div>
</template>


<script>
import axios from "axios";
import NewTaskDialogComponent from "@/components/NewTaskDialogComponent";

export default {
  components: {
    NewTaskDialogComponent,
  },
  data() {
    return {
      projectData: null,
      visible: false,
      taskid: "",
      taskModalDialog: false,
      taskDialogData: {}

    };
  },

  mounted() {
    this.getProject();
  },
  watch: {},

  methods: {
    async getProject() {
      await axios
        .get(`http://localhost:3000/api/projects/${this.$route.params.id}`)
        .then((response) => {
          (this.projectData = response.data), console.log(response);
        });
    },

    async removeTask(taskid) {
      await axios
        .put(`http://localhost:3000/api/projects/deletetask/${taskid}`)
        .then((response) => {
          (this.tasks = response.data), this.getProject();
        });
    },

      openTaskModalDialog(column) {
      this.taskDialogData = column;
      this.taskModalDialog = true;
    },
    closeTaskModalDialog() {
      this.taskDialogData = {};
      this.taskModalDialog = false;
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
      if (targetParentEl.id !== sourceIdParentEl.id) {
        // If the source and destination have the same
        // className (card), then we risk dropping a Card in to a Card
        // That may be a cool feature, but not for us!
        if (targetEl.className === sourceIdEl.className) {
          // Append to parent Object (list), not to a
          // Card in the list
          // This is in case you drag and drop a Card on top
          // of a Card in a different list
          targetParentEl.appendChild(sourceIdEl);
        } else {
          // Append to the list
          targetEl.appendChild(sourceIdEl);
        }
      } else {
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
  height: 85vh;
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
  height: 400px;
}
.board-lists:last-child {
  margin-right: 10px;
}
.board-list {
  background-color: rgb(235, 236, 240);
  border-radius: 3px;
  display: grid;
  grid-auto-rows: max-content;
  grid-gap: 10px;
  /* Chrome use a fixed height */
  height: max-content;
  min-height: 150px;
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
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.card {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  padding: 10px;
  cursor: pointer;
}

.cardList {
  max-height: 500px;
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
.more-actions {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  left: 100%;
}
ul li:nth-child(n + 2) {
  margin-top: 10px;
}
</style>