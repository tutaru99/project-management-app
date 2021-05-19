<template>
  <el-dialog
    :before-close="close"
    title="Quick Edit Task"
    v-model="editTaskModalDialog"
    width="30%"
  >
    <el-form :model="editTask" ref="editTask">
      <el-form-item
        label="Name"
        prop="editName"
        :rules="[{ required: true, message: 'Task name is required' }]"
      >
        <el-input
          type="textarea"
          v-model="editTask.editName"
          maxlength="120"
          :rows="3"
          show-word-limit
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="Desription">
        <el-input
          type="textarea"
          v-model="editTask.editDescription"
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
          @click="validateSubmitTask('editTask', editTaskDialogData._id)"
          >Update Task</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: ["editTaskModalDialog", "editTaskDialogData"],
  emits: ["edit", "close"],

  data: () => ({
    editTask: {
      editName: "",
      editDescription: "",
    },

    taskId: "",
  }),

  mounted() {
    this.editTask.editName = this.editTaskDialogData.task_name;
    this.editTask.editDescription = this.editTaskDialogData.task_description;
    this.taskId = this.editTaskDialogData._id;
  },

  methods: {
    async submitTask(taskId) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/updatetask-quick-edit/${taskId}`,
          {
            task_name: this.editTask.editName,
            task_description: this.editTask.editDescription,
          }
        )
        .then((response) => {
          (this.tasks = response.data),
            this.$notify({
              title: "Task Updated",
              type: "success",
            });
          this.close(), this.$emit("edit");
        });
    },

    validateSubmitTask(formName, taskId) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitTask(taskId);
        } else {
          return false;
        }
      });
    },

    close() {
      this.$emit("close");
    },
  },
};
</script>
