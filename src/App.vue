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
    async refresh() {
      if (
        !this.$cookies.get("jwt") &&
        location.href.substring(location.href.lastIndexOf("/") + 1) !== "register"
      ) {
        this.$router.push("/login");
        axios.defaults.headers.common["Authorization"] = null;
      } else if (
        !this.$cookies.get("jwt") &&
        location.href.substring(location.href.lastIndexOf("/") + 1) === "register"
      ) {
        axios.defaults.headers.common["Authorization"] = null;
      } else {
        axios.defaults.headers.common["Authorization"] = `bearer ${this.$cookies.get("jwt")}`;
        await this.$refs.nav.getProjectsData();
        await this.$refs.nav.getInvitedProjectsData();
      }
    },
  },
};
</script>

<style lang="scss">
@import "src/scss/_variables.scss";

#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  margin: 0;
  padding: 0;
}

* {
  /* ScrollBar */
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #d0cae5 #191a1f;
  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 12px;
  }
  *::-webkit-scrollbar-track {
    background: #191a1f;
  }
  *::-webkit-scrollbar-thumb {
    background-color: #d0cae5;
    border-radius: 20px;
    border: 5px solid #191a1f;
  }
}
.has-text-danger {
  color: red !important;
}
</style>
