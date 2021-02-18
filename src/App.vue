<template>
  <el-container id="app">
    <el-aside>
      <Navigation />
    </el-aside>
    <el-main>
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <router-view />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Dashboard from "./views/Dashboard.vue";
import Navigation from "./components/Navigation.vue";

export default {
  name: "App",
  components: {
    Dashboard,
    Navigation,
  },
};
</script>

<style lang="scss">
@import "src/scss/_variables.scss";

#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $greybg;
}
* {
  margin: 0;
  padding: 0;
}
</style>
