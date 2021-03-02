<template>
  <el-dialog title="New Task" v-model="taskModalDialog">
              <el-form :model="form">
                <el-form-item label="Task name">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Task desription">
                  <el-input
                    v-model="form.description"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="close()"
                    >Cancel</el-button
                  >
                  <el-button type="primary" @click="submitTask()"
                    >Add Task</el-button
                  >
                </span>
              </template>
            </el-dialog>
</template>

<script>
export default {
    props: ["taskModalDialog", "dialogData"],
    data:() => ({
        form: {
        name: "",
        description: "",
      },
    }),
    methods: {
    close() {
      this.$emit("close");
    },
}
}
</script>