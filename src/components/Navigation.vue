<template>
  <el-menu default-active="2" :collapse="true" router>
    <!-- <el-row justify="center" align="middle" type="flex">
    <el-radio-group
      id="arrow"
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
  </el-row> -->

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
        <template #title>
          <span class="minititle" v-if="projectsData.length">
            Personal Projects
          </span>
                    <p class="minititle" v-else>
            No Personal Projects
          </p>
        </template
        >
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
        <template #title>
          <span class="minititle" v-if="invitedProjectsData.length">
            Shared Projects
          </span>
          <p class="minititle" v-else>
            No Shared Projects
          </p>
        </template>
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

.minititle {
  color: #8112ea;
  font-weight: 700;
}
.el-menu {
  border: none !important;
}
.el-menu-item {
  color: #8112ea !important;
}
.el-icon-menu:before {
  color: #8112ea !important;
}
.el-menu--popup {
  box-shadow: none !important;
}
</style>
