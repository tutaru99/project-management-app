<template>
  <el-row justify="center" type="flex">
    <el-col :span="12">
      <el-form :model="formInline" class="demo-form">
        <el-form-item label="E-mail">
          <el-input
            placeholder="E-mail"
            v-model="email"
            type="text"
            name="email"
          />
        </el-form-item>
        <el-form-item label="Username">
          <el-input
            placeholder="Username"
            v-model="username"
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
          <p>
            &nbsp;
            {{errors}}
          </p>
        <el-form-item>
          <el-button type="primary" @click="register">Register</el-button>
        </el-form-item>
        <a href="/login">Click here to login</a>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: null,
      email: null,
      password: null,
      errors: null
    };
  },
  methods: {
    async register() {
      const user = {
        username: this.username,
        email: this.email,
        password: this.password,
      };
      await axios.post("http://localhost:3000/api/user/register", user)
        .catch(err => {
            this.errors = err.response.data.error
        })
    },
  },
};
</script>

<style lang="scss" scoped>
</style>