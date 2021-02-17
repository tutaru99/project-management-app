<template>

  <Navigation />
  <!--  remove eslint-error with comment below -->
  <!-- eslint-disable-next-line -->
  <div class="center">
      <img src="./assets/logo.png" />
    <p>
      If Element Plus is successfully added to this project, you'll see an
      <code v-text="'<el-button>'"></code>
      below
    </p>
    <el-link href="https://element-plus.org/#/en-US" target="_blank">
      <el-button type="primary"
        >Element-Plus button with link</el-button
      ></el-link
    >
    || <el-button type="primary">Element-Plus button w/o link</el-button>
    <HomeComponent />
  </div>
</template>

<script>
import HomeComponent from "./components/HomeComponent.vue";
import Navigation from "./components/Navigation.vue";

export default {
  name: "App",
  components: {
    HomeComponent,
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
}
*{
  margin: 0;
  padding: 0;
}
.center {
  text-align: center;
}
</style>
