<template>
  <div class="template">
    <el-row class="notFound" justify="center" align="middle" type="flex">
      <h1>404</h1>
    </el-row>
    <el-row justify="center" align="middle" type="flex">
      <h1>Page not found</h1>
    </el-row>
    <el-row justify="center" align="middle" type="flex">
      <router-link class="a" to="/">
        Back Home
      </router-link>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  font-size: 150px;
}
.template {
  height: 80vh;
}
.notFound {
  margin-top: 100px;
}
.a {
  margin-top: 150px;
  color: rgb(0, 0, 0);
  font-size: 110px;
}
</style>
