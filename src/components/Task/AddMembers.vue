
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
      <div class="value">{{ item.value }}</div>
    </template>
  </el-autocomplete>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
export default defineComponent({
  setup() {
    const links = ref([]);

    const querySearch = (queryString, cb) => {
      var results = queryString
        ? links.value.filter(createFilter(queryString))
        : links.value;
      // call callback function to return suggestion objects
      cb(results);
    };
    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    };
    const loadAll = () => {
      return [
        { value: "Username?"},
        { value: "Choose"},
        { value: "from"},
        { value: "added"},
        { value: "Users"},
        { value: "to this"},
        { value: "project"},
      ];
    };
    const handleSelect = (item) => {
      console.log(item);
    };

    const handleIconClick = (ev) => {
      console.log(ev);
    };

    onMounted(() => {
      links.value = loadAll();
    });

    return {
      state: ref(""),
      querySearch,
      createFilter,
      loadAll,
      handleSelect,
      handleIconClick,
    };
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
