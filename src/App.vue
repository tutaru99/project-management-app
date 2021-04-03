<template>
  <el-container id="app">
    <!-- undefined width style makes drawer responsive on minimize/maximize -->
      <Navigation ref="nav"/>
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
    return {
      isAuth: this.$cookies.get('jwt')
    }
  },
  watch: {
    isAuth: function (val) {
      this.isAuthSetHeaders()
    },
    '$route' (to, from) {
      this.$refs.nav.getProjectsData()
    }
  },
  created() {  
    this.isAuthSetHeaders()
  },

  methods: {
    async refresh() {
      await this.$refs.nav.getProjectsData()
    },

    async isAuthSetHeaders() {
      if(!this.isAuth) {
        this.$router.push('/login')
      } else {
        axios.defaults.headers.common['Authorization'] = `bearer ${ this.$cookies.get('jwt') }`;
      }
    }
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
</style>
