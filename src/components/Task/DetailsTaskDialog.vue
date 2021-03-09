<template>
  <el-dialog
    :before-close="close"
    title="DETAILS"
    v-model="detailsTaskDialog"
    width="80%"
  >
    <el-main>
      <el-row type="flex">
        <el-col :span="24" :offset="0">
          <h1>Task Details</h1>
        </el-col>
        <el-col :span="6">
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
        </el-col>
      </el-row>
    </el-main>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close()">Cancel</el-button>
        <el-button type="primary" @click="submitTask(detailsTaskDialogData._id)"
          >Submit</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: ["detailsTaskDialog", "detailsTaskDialogData"],
  emits: ["submit", "close"],
  data: () => ({
    editName: "",
    editDescription: "",
    taskId: "",
  }),
  mounted() {
    this.editName = this.detailsTaskDialogData.task_name;
    this.editDescription = this.detailsTaskDialogData.task_description;
    this.taskId = this.detailsTaskDialogData._id;
  },
  methods: {
    async submitTask(taskId) {
      await axios
        .put(`http://localhost:3000/api/projects/updatetask/${taskId}`, {
          task_name: this.editName,
          task_description: this.editDescription,
        })
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