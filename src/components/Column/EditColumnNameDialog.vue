<template>
  <el-dialog
    :before-close="close"
    title="Edit List Name"
    v-model="editColumnNameModalDialog"
    width="30%"
  >
    <el-form :model="editListName" ref="editListName">
      <el-form-item
        label="List name"
        prop="name"
        :rules="[{ required: true, message: 'List name is required' }]"
      >
        <el-input
          placeholder="Enter list name"
          v-model="editListName.name"
          autocomplete="off"
          maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close()">Cancel</el-button>
        <el-button
          type="primary"
          @click="
            validateSubmitColName(
              'editListName',
              editColumnNameModalDialogData._id
            )
          "
          >Update List Name</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: ["editColumnNameModalDialog", "editColumnNameModalDialogData"],
  emits: ["create", "close"],

  data: () => ({
    editListName: {
      name: "",
    },

    colid: "",
  }),

  mounted() {
    this.editListName.name = this.editColumnNameModalDialogData.col_name;
  },

  methods: {
    close() {
      this.$emit("close");
    },
    async submitColName(colid) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/editcolumn/${colid}`,
          {
            col_name: this.editListName.name,
          }
        )
        .then((response) => {
          (this.tasks = response.data), this.close(), this.$emit("create");
                      this.$notify({
              title: "List name updated",
              type: "success",
            });
        });
    },

    validateSubmitColName(formName, colid) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitColName(colid);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
