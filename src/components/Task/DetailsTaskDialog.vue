<template>
  <el-dialog
    :before-close="close"
    title="DETAILS"
    v-model="detailsTaskDialog"
    width="50%"
  >
    <el-main>
      <el-row type="flex">
        <el-col :span="7" :offset="1">
          <h1>Task Details</h1>
          <p class="bold mt-2">Task name</p>
          <el-form :model="detailsEdit" ref="detailsEdit">
            <el-form-item
              prop="editName"
              :rules="[{ required: true, message: 'Task name is required' }]"
            >
              <el-input
                v-model="detailsEdit.editName"
                maxlength="100"
                show-word-limit
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <p class="bold mt-2">Task Description</p>
            <el-form-item>
              <el-input
                type="textarea"
                v-model="detailsEdit.editDescription"
                autocomplete="off"
                :rows="5"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" :offset="1">
          <h1>Priority</h1>
          <p class="bold mt-2">Priority of the task</p>
          <el-select v-model="priorityValue" placeholder="Choose Priority">
            <el-option
              v-for="priority in priorities"
              :key="priority.value"
              :label="priority.label"
              :value="priority.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" :offset="1">
          <h1>Actions</h1>
          <p class="bold mt-2">Assign members to task</p>
          <AddMembers />
          <br /><br />
          <p class="bold mt-2">Task State</p>
          <el-radio-group v-model="taskProgress" size="small">
            <el-radio-button label="In Progress"></el-radio-button>
            <el-radio-button label="On Hold"></el-radio-button>
            <el-radio-button label="Completed"></el-radio-button>
          </el-radio-group>

          <p class="bold mt-3">Estimate time to complete</p>
          <el-input-number
            v-model="timeSelect"
            :precision="2"
            :model-value="timeSelect"
            :step="0.1"
            :max="24"
            :min="0"
          ></el-input-number>
          <el-button
            id="mt-3"
            class="mt-3"
            icon="el-icon-delete"
            @click="removeTask(detailsTaskDialogData._id)"
            >Delete Task</el-button
          >
        </el-col>
      </el-row>
    </el-main>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close()">Cancel</el-button>
        <el-button type="primary" @click="validateSubmitTask('detailsEdit', detailsTaskDialogData._id)"
          >Submit</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import AddMembers from "./AddMembers.vue";
import axios from "axios";
export default {
  components: {
    AddMembers,
  },
  props: ["detailsTaskDialog", "detailsTaskDialogData"],
  emits: ["submit", "close"],

  data: () => ({

    detailsEdit: {
      editName: "",
      editDescription: "",
    },

    taskId: "",

    priorities: [
      {
        value: "Option1",
        label: "Low",
      },
      {
        value: "Option2",
        label: "Medium",
      },
      {
        value: "Option3",
        label: "High",
      },
      {
        value: "Option4",
        label: "Very High",
      },
    ],
    taskProgress: "In Progress",
    timeSelect: null,
    priorityValue: "",
  }),

  mounted() {
    this.detailsEdit.editName = this.detailsTaskDialogData.task_name;
    this.detailsEdit.editDescription = this.detailsTaskDialogData.task_description;

    this.taskId = this.detailsTaskDialogData._id;
    this.timeSelect = this.detailsTaskDialogData.task_time;
    this.taskProgress = this.detailsTaskDialogData.task_state;

    this.priorityValue = this.detailsTaskDialogData.task_priority;
  },

  methods: {
    async submitTask(taskId) {
      await axios
        .put(`http://localhost:3000/api/projects/updatetask/${taskId}`, {
          task_name: this.detailsEdit.editName,
          task_description: this.detailsEdit.editDescription,
          task_time: this.timeSelect,
          task_state: this.taskProgress,
          task_priority: this.priorityValue,
        })
        .then((response) => {
          (this.tasks = response.data), this.close(), this.$emit("submit");
        });
    },

     validateSubmitTask(formName, taskId) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitTask(taskId)
          } else {
            return false;
          }
        });
      },



    async removeTask(taskid) {
      await axios
        .put(`http://localhost:3000/api/projects/deletetask/${taskid}`)
        .then((response) => {
          (this.tasks = response.data), this.close(), this.$emit("submit");
        });
    },

    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
#mt-3 {
  margin-top: 30px;
}
.bold {
  font-weight: bold;
}
.mt-2 {
  margin-top: 10px;
}
</style>