<template>
  <div>
    <!-- v-if acts as a loader otherwise data doesnt show -->
    <div class="board-layout" v-if="projectData">
      <div class="left">
        <div class="board-text">{{ projectData.title }}</div>
      </div>
      <!-- whole board element -->
      <div id="boardlists" class="board-lists">
        <!-- whole card -->
        <div
          v-for="(column, colNo) in projectData.columns"
          :key="column.id"
          :id="`list${colNo}`"
          class="board-list"
          @drop="dropIt($event)"
          @dragover="allowDrop($event)"
        >
          <div class="list-title">{{ column.col_name }}</div>

          <!-- :id="`card${taskNo}${colNo}`"  == is a stupid solution,
          ask Nikolai's oppinion how it
          should be solved  -->
          <div
            v-for="(task, taskNo) in column.tasks"
            :key="task.id"
            :id="`card${taskNo}${colNo}`"
            class="card"
            draggable="true"
            @dragstart="dragStart($event)"
          >
            {{ task.task_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      projectData: null,
    };
  },

  mounted() {
    this.getProject();
  },

  methods: {
    async getProject() {
      await axios
        .get(`http://localhost:3000/api/projects/${this.$route.params.id}`)
        .then((response) => {
          (this.projectData = response.data), console.log(response);
        });
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
@import "src/scss/_variables.scss";
.board-layout {
  background-color: rgb(100, 92, 165);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  display: grid;
  grid-template-rows: max-content auto;
  grid-gap: 10px;
  padding: 10px;
  height: 800px;
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
}
.card {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  padding: 10px;
  cursor: pointer;
}
</style>