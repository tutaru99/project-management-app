<template>
  <el-main>
    <el-row type="flex">
      <el-table :data="usersData" style="width: 100%">
        <el-table-column prop="username" label="Username"> </el-table-column>
        <el-table-column prop="email" label="Email"> </el-table-column>
        <el-table-column prop="role" label="Role">
          <template #default="scope">
            <el-select
              v-if="!scope.row.isOwner"
              :disabled="
                currentUserRole === 'OWNER'
                  ? false
                  : currentUserRole === 'ADMIN'
                  ? false
                  : true
              "
              v-model="scope.row.role"
              placeholder="Change permission"
            >
              <el-option
                v-for="item in permissions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @click="changeUserPermission(scope.row, item.value)"
              >
              </el-option>
            </el-select>
            <p v-else>
              Owner
            </p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Actions" width="120">
          <template
            v-if="currentUserRole === 'OWNER' || currentUserRole === 'ADMIN'"
            #default="scope"
          >
            <el-button
              v-if="!scope.row.isOwner"
              @click="removeUser(scope.row)"
              type="text"
              size="small"
              >Remove</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-main>
  <el-row type="flex" justify="end">
    <el-col :span="4">
      <el-button class="mt-1" @click="close()">Close</el-button>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
export default {
  props: ["users", "usersRoles", "currentUserRole", "projectId"],
  emits: ["removed", "close"],

  data: () => ({
    dialog: true,
    usersData: [],
    permissionValue: "",
    permissions: [
      {
        value: "ADMIN",
        label: "Admin",
      },
      {
        value: "USER",
        label: "User",
      },
    ],
  }),

  mounted() {
    this.usersWithRoles();
  },

  methods: {
    async removeUser(user) {
      await axios
        .post(`${process.env.VUE_APP_BASE_URL_API}/api/projects/remove-user`, {
          userEmail: user.email,
          projectId: this.projectId,
          userMakingRequestId: this.$store.state.auth.id
        })
        .then(() => {
          this.$notify({
            title: "Member Removed",
            message: "Member has been removed from the project!",
            type: "success",
          });
          this.$emit("removed");
          this.$emit("close");
        });
    },
    async changeUserPermission(user, permission) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/change-user-permission`,
          {
            userId: user._id,
            projectId: this.projectId,
            newPermission: permission,
          },
          {
            headers: {
              role: this.currentUserRole,
            },
          }
        )
        .then(() => {
          this.$emit("removed");
          this.$emit("close");
        });
    },
    usersWithRoles() {
      for (var singleUser of this.users) {
        for (var role of this.usersRoles.users) {
          if (singleUser.id === role.userId) {
            let userObjToPush = {
              _id: singleUser.id,
              username: singleUser.username,
              email: singleUser.email,
              role: role.role,
            };
            this.usersData.push(userObjToPush);
            this.permissionValue = role.role;
          }
        }
      }
      //get owner details
      axios
        .post(`${process.env.VUE_APP_BASE_URL_API}/api/user/info`, [
          this.usersRoles.owner[0],
        ])
        .then((res) => {
          const ownerObj = {
            username: res.data[0].username,
            email: res.data[0].email,
            isOwner: true,
          };
          this.usersData.push(ownerObj);
        });
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.mt-1 {
  margin-top: 20px;
}
</style>
