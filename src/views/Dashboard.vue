<template>
  <div>
    <el-main>
      <el-row type="flex" justify="">
        <el-col :span="24">
          <h1>Dashboard Page View</h1>
          <p>Project Management Application</p>
          <div>
            <el-button>Button Test</el-button>
            <h2>The quick brown fox jumped over the lazy dog</h2>
          </div>
          <div>
            <el-link href="https://element-plus.org/#/en-US" target="_blank">
              <el-button type="primary"
                >Element-Plus button with link</el-button
              ></el-link
            >
            ||
            <el-button type="primary">Element-Plus button w/o link</el-button>
          </div>
          <br />
          <br />
          <br />
          <DashboardComponent />
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
// @ is an alias to /src
import DashboardComponent from "@/components/DashboardComponent.vue";

export default {
  name: "Dashboard",
  components: {
    DashboardComponent,
  },
};
</script>

<style lang="scss" scoped>
@import "src/scss/_variables.scss";

</style>