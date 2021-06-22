<template>
  <el-container id="app">
    <!-- undefined width style makes drawer responsive on minimize/maximize -->
    <Navigation ref="nav" />
    <el-main>
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <router-view :key="$route.fullPath" @refreshData="refresh" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Dashboard from "./views/Dashboard.vue";
import Navigation from "./components/Navigation.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    Dashboard,
    Navigation,
  },
  data() {
    return {};
  },
  watch: {
    $route(to, from) {
      this.refresh();
    },
  },
  mounted() {
    this.refresh();
  },
  methods: {
    /*
     * User authorization check that is being called by
     * emmit event - refreshData everytime user changes a route.
     */
    async refresh() {
      if (
        !this.$cookies.get("jwt") &&
        location.href.substring(location.href.lastIndexOf("/") + 1) !==
          "register"
      ) {
        this.$router.push("/login");
        axios.defaults.headers.common["Authorization"] = null;
      } else if (
        !this.$cookies.get("jwt") &&
        location.href.substring(location.href.lastIndexOf("/") + 1) ===
          "register"
      ) {
        axios.defaults.headers.common["Authorization"] = null;
      } else {
        axios.defaults.headers.common[
          "Authorization"
        ] = `bearer ${this.$cookies.get("jwt")}`;
        await this.$refs.nav.getProjectsData();
        await this.$refs.nav.getInvitedProjectsData();
      }
    },
  },
};
</script>

<style lang="scss">
@import "src/scss/_variables.scss";
@import "src/scss/_dark-mode.scss";
@import "src/scss/_mode-toggle.scss";
@import "src/scss/light-mode.scss";

#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  margin: 0;
  padding: 0;
}


</style>
