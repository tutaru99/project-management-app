<template>
  <el-dialog
    :before-close="close"
    append-to-body
    title="DETAILS"
    v-model="detailsTaskDialog"
    width="70%"
  >
    <el-main>
      <el-row type="flex">
        <el-col :span="7" :offset="1">
          <h2>Task Details</h2>
          <p class="bold mt-2">Task name</p>
          <el-form :model="detailsEdit" ref="detailsEdit">
            <el-form-item
              prop="editName"
              :rules="[{ required: true, message: 'Task name is required' }]"
            >
              <el-input
                v-model="detailsEdit.editName"
                type="textarea"
                maxlength="120"
                :rows="4"
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
                :rows="8"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" :offset="1">
          <h2>Task Priority</h2>
          <p class="bold mt-2">Priority level</p>
          <el-select v-model="priorityValue" placeholder="Choose Priority">
            <el-option
              v-for="priority in priorities"
              :key="priority.value"
              :label="priority.label"
              :value="priority.value"
            >
            </el-option>
          </el-select>
          <p class="bold mt-3">Estimate time to complete (minutes)</p>
          <el-input-number
            v-model="timeSelect"
            :model-value="timeSelect"
            :precision="0"
            :step="5"
            :min="0"
            :max="1000"
          ></el-input-number>
          <p class="bold mt-3">Task State</p>
          <el-radio-group v-model="taskProgress" size="small">
            <el-radio-button label="In Progress"></el-radio-button>
            <el-radio-button label="On Hold"></el-radio-button>
            <el-radio-button label="Completed"></el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="6" :offset="1">
          <h2>Actions</h2>
          <p class="bold mt-2">Assign members to task</p>
          <AddMembers
            :taskId="detailsTaskDialogData._id"
            :users="usersNotAddedToTaskArr"
            @refresh="$emit('submit')"
          />
          <br />
          <div v-if="usersAddedToTaskArr">
            <p class="bold mt-1 pb-1">Members:</p>
            <p v-for="user in usersAddedToTaskArr" :key="user.id">
              <el-row
                class="mt-1"
                type="flex"
                align="middle"
                justify="space-between"
              >
                <b>
                  <el-col class="mt-1">
                    <i class="el-icon-user" style="font-size: 28px"></i>
                  </el-col>
                  <el-col>
                    {{ user.username }}
                    <br />
                    <small>
                      {{ user.email }}
                    </small>
                  </el-col>
                </b>
                <el-button
                  class="ml-1"
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  size="mini"
                  circle
                  @click="removeUserFromTask(user.email)"
                >
                </el-button>
              </el-row>
            </p>
          </div>
          <p v-else>No Members Assigned to this Task.</p>

          <el-button
            class="mt-4"
            type="danger"
            plain
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
        <el-button
          type="primary"
          @click="validateSubmitTask('detailsEdit', detailsTaskDialogData._id)"
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
  props: [
    "detailsTaskDialog",
    "detailsTaskDialogData",
    "projectOwner",
    "users",
  ],
  emits: ["submit", "close"],

  data: () => ({
    email: null,
    detailsEdit: {
      editName: "",
      editDescription: "",
    },
    usersAddedToTaskArr: null,
    usersNotAddedToTaskArr: null,

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

  watch: {
    users: function(newVal, oldVal) {
      this.usersAddedToTask();
      this.usersNotAddedToTask();
    },
  },

  mounted() {
    this.detailsEdit.editName = this.detailsTaskDialogData.task_name;
    this.detailsEdit.editDescription = this.detailsTaskDialogData.task_description;

    this.taskId = this.detailsTaskDialogData._id;
    this.timeSelect = this.detailsTaskDialogData.task_time;
    this.taskProgress = this.detailsTaskDialogData.task_state;

    this.priorityValue = this.detailsTaskDialogData.task_priority;
    this.usersAddedToTask();
    this.usersNotAddedToTask();
  },

  methods: {
    async usersNotAddedToTask() {
      let usersArr = [];
      usersArr.push(
        this.users.filter(
          (user) => !this.detailsTaskDialogData.asignee.includes(user.id)
        )
      );
      function checkArrayForValue(arr, value) {
        return value.some((val) => arr.includes(val));
      }
      if (
        !checkArrayForValue(
          this.detailsTaskDialogData.asignee,
          this.projectOwner
        )
      ) {
        await axios
          .post(
            `${process.env.VUE_APP_BASE_URL_API}/api/user/info`,
            this.projectOwner
          )
          .then((res) => {
            usersArr[0].push(
              new Proxy(
                {
                  id: res.data[0].id,
                  username: res.data[0].username,
                  email: res.data[0].email,
                  isOwner: true,
                },
                {}
              )
            );
          });
      }
      this.usersNotAddedToTaskArr = usersArr[0];
    },

    async usersAddedToTask() {
      let arr = [];
      for (const asignee of this.detailsTaskDialogData.asignee) {
        const filteredArr = this.users.filter(function(user) {
          return user.id === asignee;
        });
        if (filteredArr[0]) {
          arr.push(filteredArr[0]);
        }
        if (asignee == this.projectOwner) {
          await axios
            .post(
              `${process.env.VUE_APP_BASE_URL_API}/api/user/info`,
              this.projectOwner
            )
            .then((res) => {
              arr.push(
                new Proxy(
                  {
                    id: res.data[0].id,
                    username: res.data[0].username,
                    email: res.data[0].email,
                    isOwner: true,
                  },
                  {}
                )
              );
            });
        }
      }
      return (this.usersAddedToTaskArr = arr);
    },

    async submitTask(taskId) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/updatetask/${taskId}`,
          {
            task_name: this.detailsEdit.editName,
            task_description: this.detailsEdit.editDescription,
            task_time: this.timeSelect,
            task_state: this.taskProgress,
            task_priority: this.priorityValue,
          }
        )
        .then((response) => {
          (this.tasks = response.data),
            this.$notify({
              title: "Task Details Updated",
              type: "success",
            });
          this.close(), this.$emit("submit");
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

    async removeTask(taskid) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/deletetask/${taskid}`
        )
        .then((response) => {
          (this.tasks = response.data),
            this.$notify({
              title: "Task Removed",
              type: "success",
            });
          this.close(), this.$emit("submit");
        });
    },

    async removeUserFromTask(email) {
      await axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/projects/task/remove-user/`,
          {
            taskId: this.detailsTaskDialogData._id,
            userEmail: email,
          }
        )
        .then((response) => {
          (this.tasks = response.data), this.$emit("submit");
        });
    },

    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.bold {
  font-weight: bold;
}
.mt-1 {
  margin-top: 5px;
}
.ml-1 {
  margin-left: 5px;
}
.mt-2 {
  margin-top: 10px;
}
.mt-3 {
  margin-top: 30px;
}
.mt-4 {
  margin-top: 20px;
}
</style>
