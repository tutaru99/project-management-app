<template>
  <div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
      <el-radio-group v-model="isCollapse">
        <el-radio-button circle v-if="isCollapse == true" :label="false"
          ><i class="el-icon-d-arrow-right"></i
        ></el-radio-button>
        <el-radio-button :label="true" v-if="isCollapse == !true"
          ><i class="el-icon-d-arrow-left"></i
        ></el-radio-button>
      </el-radio-group>
      <el-divider></el-divider>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <template #title>Dashboard</template>
      </el-menu-item>
      <el-submenu index="1">
        <template #title>
          <i class="el-icon-location"></i>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3">
        <i class="el-icon-menu"></i>
        <template #title>Navigator Two</template>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <template #title>Navigator Three</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/scss/_variables.scss";

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu {
  border-bottom: 1px solid #e6e6e6;
}
</style>