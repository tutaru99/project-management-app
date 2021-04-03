<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="$store.state.isCollapse"
    router
  >
    <el-radio-group id="stuff"
      :collapse="$store.commit('isCollapseState')"
      v-model="$store.state.isCollapse"
    >
      <el-radio-button
        circle
        v-if="$store.state.isCollapse == true"
        :label="false"
        ><i class="el-icon-d-arrow-right"></i
      ></el-radio-button>
      <el-radio-button :label="true" v-if="$store.state.isCollapse == !true"
        ><i class="el-icon-d-arrow-left"></i
      ></el-radio-button>
    </el-radio-group>

    <el-menu-item index="/">
      <i class="el-icon-menu"></i>
      <template #title>Dashboard</template>
    </el-menu-item>
    <el-submenu index="1">
      <template #title>
        <i class="el-icon-folder-opened"></i>
        <span>Projects</span>
      </template>
      <el-menu-item-group >
        <router-link
          v-for="project in projectsData.slice().reverse()"
          :key="project.key"
          :to="{ path: '/projectboard/' + project._id }"
        >
          <el-menu-item>{{ project.title }}</el-menu-item>
        </router-link>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="5">
      <i class="el-icon-menu"></i>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="5">
      <i class="el-icon-setting"></i>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-row justify="center" type="flex">
      <el-button @click="logout">
        Logout
      </el-button>
    </el-row>
  </el-menu>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      projectsData: [],
    };
  },
  mounted() {
    this.getProjectsData();
  },
  methods: {
    async getProjectsData() {
      if(!this.$cookies.get('jwt')) {
        this.$router.push('/login')
        axios.defaults.headers.common['Authorization'] = null;
      } else {
        axios.defaults.headers.common['Authorization'] = `bearer ${ this.$cookies.get('jwt') }`;
        await axios
          .get("http://localhost:3000/api/projects")
          .then((response) => (this.projectsData = response.data));
      }
    },
    logout() {
      this.$cookies.remove('jwt');
      axios.defaults.headers.common['Authorization'] = null;
      this.$router.push('/login');
    }
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
a {
  text-decoration: none;
}
#stuff{
  margin-top: 10px;
  margin-left: 7%;
}
</style>