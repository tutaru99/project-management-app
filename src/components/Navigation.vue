<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="$store.state.isCollapse"
    router
  >
    <el-radio-group
      id="stuff"
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
    <el-submenu index="1" v-if="$store.state.auth.id">
      <template #title>
        <i class="el-icon-folder-opened"></i>
        <span>Projects</span>
      </template>
      <!-- Owned Projects -->
      <el-menu-item-group>
        <template #title><span>Personal Projects</span></template>
        <router-link
          v-for="project in projectsData.slice().reverse()"
          :key="project.key"
          :to="{ path: '/projectboard/' + project._id }"
        >
          <el-menu-item>{{ project.title }}</el-menu-item>
        </router-link>
      </el-menu-item-group>
      <!-- Projects User is part of/invited to (collab)-->
      <el-menu-item-group>
        <template #title><span>Shared Projects</span></template>
        <router-link
          v-for="project in invitedProjectsData.slice().reverse()"
          :key="project.key"
          :to="{ path: '/projectboard/' + project._id }"
        >
          <el-menu-item>{{ project.title }}</el-menu-item>
        </router-link>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/login" v-if="$store.state.auth.id" @click="logout">
      <i class="mdi mdi-logout"></i>
      <template #title>Sign Out</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      projectsData: [],
      invitedProjectsData: [],
    };
  },
  methods: {
    async getProjectsData() {
      await axios
        .get(`${process.env.VUE_APP_BASE_URL_API}/api/projects`)
        .then((response) => (this.projectsData = response.data));
    },
    async getInvitedProjectsData() {
      await axios
        .get(`${process.env.VUE_APP_BASE_URL_API}/api/projects/invited`)
        .then((response) => (this.invitedProjectsData = response.data));
    },
    logout() {
      this.$store.commit("logOut");
      this.$cookies.remove("jwt");
      axios.defaults.headers.common["Authorization"] = null;
      this.$router.push("/login");
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
a {
  text-decoration: none;
}
#stuff {
  margin-top: 10px;
  margin-left: 7%;
}
</style>