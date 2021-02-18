<template>
  <el-container>
    <el-main id="wrapper">
      <el-row type="flex">
        <el-col :span="24">
          <h1>Dashboard Component</h1>
          <p>The quick brown fox jumped over the lazy dog</p>
          <p>text styling is fucked with the components, need to investigate further</p>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {};
</script>


<style lang="scss" scoped>
@import "src/scss/_variables.scss";
/* default padding/margin coming from the framework */
#wrapper{
  padding: 0;
  margin: 0;
}
</style>
