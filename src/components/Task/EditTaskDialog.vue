<template>
  <el-dialog
    :before-close="close"
    title="Edit Task"
    v-model="editTaskModalDialog"
    width="30%"
  >
    <el-form>
      <el-form-item label="Name">
        <el-input v-model="editName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Desription">
        <el-input
          type="textarea"
          v-model="editDescription"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close()">Cancel</el-button>
        <el-button type="primary" @click="submitTask(editTaskDialogData._id)"
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
    editName: "",
    editDescription: "",
    taskId: "",
  }),
  mounted() {
    this.editName = this.editTaskDialogData.task_name;
    this.editDescription = this.editTaskDialogData.task_description;
    this.taskId = this.editTaskDialogData._id;
  },
  methods: {
    async submitTask(taskId) {
      await axios
        .put(`http://localhost:3000/api/projects/updatetask/${taskId}`, {
          task_name: this.editName,
          task_description: this.editDescription,
        })
        .then((response) => {
          (this.tasks = response.data), this.close(), this.$emit("edit");
        });
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>