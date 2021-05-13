<template>
  <el-dialog
    :before-close="close"
    title="New Task"
    v-model="taskModalDialog"
    width="30%"
  >
    <el-form :model="newTask" ref="newTask">
      <el-form-item
        label="Task name"
        prop="name"
        :rules="[{ required: true, message: 'Task name is required' }]"
      >
        <el-input
          placeholder="Enter task name"
          v-model="newTask.name"
          autocomplete="off"
          type="textarea"
          :rows="2"
          maxlength="120"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="Task desription">
        <el-input
          type="textarea"
          placeholder="Enter task description"
          v-model="newTask.description"
          autocomplete="off"
          maxlength="200"
          :rows="5"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close()">Cancel</el-button>
        <el-button
          type="primary"
          @click="validateSubmitTask('newTask', dialogData._id)"
          >Add Task</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: ["taskModalDialog", "dialogData"],
  emits: ["create", "close"],

  data: () => ({
    newTask: {
      name: "",
      description: "",
    },

    colid: "",
  }),

  methods: {
    close() {
      this.$emit("close");
    },
    async submitTask(colid) {
      await axios
        .put(`${process.env.VUE_APP_BASE_URL_API}/api/projects/addtask/${colid}`, {
          task_name: this.newTask.name,
          task_description: this.newTask.description,
        })
        .then((response) => {
          (this.tasks = response.data), this.close(), this.$emit("create");
        });
    },

    validateSubmitTask(formName, colid) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitTask(colid);
        } else {
          return false;
        }
      });
    },
  },
};
</script>