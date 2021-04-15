<template>
    <el-main>
      <el-row type="flex">
        <el-table :data="usersData" style="width: 100%">
          <el-table-column prop="username" label="Name">
          </el-table-column>
          <el-table-column prop="email" label="E-mail">
          </el-table-column>
          <el-table-column prop="role" label="Role">
             <template #default="scope">
               <el-select v-model="scope.row.role" placeholder="Change permission">
                <el-option
                  v-for="item in permissions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click="changeUserPermission(scope.row, item.value)"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Actions" width="120">
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
  props: [ "users", "usersRoles", "currentUserRole", "projectId"],
  emits: [ "removed", "close" ],

  data: () => ({
    dialog: true,
    usersData: [],
    permissionValue: '',
    permissions: [{
      value: 'OWNER',
      label: 'Owner'
    },
    {
      value: 'ADMIN',
      label: 'Admin'
    },{
      value: 'USER',
      label: 'User'
    }],
  }),

  mounted() {
    this.usersWithRoles()
  },

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
    },
    async changeUserPermission(user, permission) {
      await axios.put('http://localhost:3000/api/projects/change-user-permission', {
        userId: user._id,
        projectId: this.projectId,
        newPermission: permission
      },{
        headers: {
          role: this.currentUserRole
        }
      }).then(() => {
        this.$emit('removed')
        this.$emit('close')
      }
      )
    },
    usersWithRoles() {
      for (var singleUser of this.users) {
        for (var role of this.usersRoles){
          if (singleUser.id === role.userId){
            let objToPush = {
              _id: singleUser.id,
              username: singleUser.username,
              email: singleUser.email,
              role: role.role
            }
            this.usersData.push(objToPush)
            this.permissionValue = role.role
          }
        }
      }
    }
  },
};
</script>