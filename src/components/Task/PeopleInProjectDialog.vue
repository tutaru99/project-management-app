<template>
    <el-main>
      <el-row type="flex">
        <el-table :data="users" style="width: 100%">
          <el-table-column prop="username" label="Name">
          </el-table-column>
          <el-table-column prop="email" label="E-mail">
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="120">
            <template #default="scope">
              <el-button @click="removeUser(scope.row)" type="text" size="small">Remove</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-main>
</template>

<script>
import axios from "axios";
export default {
  props: [ "users", "projectId"],
  emits: [ "removed", "close" ],

  data: () => ({
    dialog: true
  }),

  methods: {
    async removeUser(user) {
      await axios.post('http://localhost:3000/api/projects/remove-user', {
        userEmail: user.email,
        projectId: this.projectId
      }).then(() => {
        this.$emit('removed')
        this.$emit('close')
      }
      )
    }
  },
};
</script>