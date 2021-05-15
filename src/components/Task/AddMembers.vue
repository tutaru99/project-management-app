<template>
  <el-autocomplete
    popper-class="my-autocomplete"
    v-model="state"
    :fetch-suggestions="querySearch"
    placeholder="Find Member"
    @select="handleSelect"
  >
    <template #suffix>
      <i class="el-icon-plus el-input__icon" @click="handleIconClick"></i>
    </template>
    <template #default="{ item }">
      <div @click="addUser(item.email)">{{ item.email }}</div>
    </template>
  </el-autocomplete>
</template>

<script>
import { defineComponent, ref, onMounted, onUpdated } from "vue";
import axios from "axios";
export default defineComponent({
  props: ["taskId", "users"],
  emits: ["refresh"],
  setup(props) {
    const links = ref([]);

    const querySearch = (queryString, cb) => {
      var results = queryString
        ? links.email.filter(createFilter(queryString))
        : links.email;
      // call callback function to return suggestion objects
      cb(results);
    };
    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.email.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    };
    const handleSelect = (item) => {
      // console.log(item);
    };

    const handleIconClick = (ev) => {
      // console.log(ev);
    };

    onMounted(() => {
      links.email = props.users;
    });

    onUpdated(() => {
      links.email = props.users;
    });

    return {
      state: ref(""),
      userEmail: null,
      querySearch,
      createFilter,
      handleSelect,
      handleIconClick,
    };
  },
  methods: {
    async addUser(email) {
      await axios
        .put(`${process.env.VUE_APP_BASE_URL_API}/api/projects/task/add-user`, {
          taskId: this.taskId,
          userEmail: email,
        })
        .then(() => {
          this.$emit("refresh");
        });
    },
  },
});
</script>

<style>
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}
</style>
