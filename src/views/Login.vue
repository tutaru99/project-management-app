<template>
    <el-row justify="center" type="flex">
      <el-col :span="12">
        <el-form :model="formInline" class="demo-form">
          <el-form-item label="E-mail">
            <el-input
              placeholder="E-mail"
              v-model="email"
              type="text"
              name="username"
            />
          </el-form-item>
          <el-form-item label="Password">
            <el-input
              v-model="password"
              type="password"
              show-password
              placeholder="Password"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">Login</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
      Use these <br>
      email: nikoTestUser@nikosad.cdasda <br>
      password: 123456
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    async login() {
      const user = {
        email: this.email,
        password: this.password,
      };
      await axios
        .post("http://localhost:3000/api/user/login", user, {
          withCredentials: true,
        })
        .then((response) => {
          this.$cookies.set("jwt", response.data.token);
          this.$router.push("/");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>