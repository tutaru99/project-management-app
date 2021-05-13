<template>
  <div class="template">
    <el-row class="RegisterForm" justify="center" align="middle" type="flex">
      <el-col :span="8">
           <h2>Login</h2>
        <el-form :model="formInline" class="mt-1 demo-form">
          <el-form-item label="E-mail">
            <el-input
              placeholder="E-mail"
              v-model="formInline.email"
              type="text"
              name="username"
            />
          </el-form-item>
          <el-form-item label="Password">
            <el-input
              v-model="formInline.password"
              type="password"
              show-password
              placeholder="Password"
            />
          </el-form-item>
          <el-form-item>
          <p class="pb-2">
            {{errors}}
          </p>
            <el-button type="primary" @click="login">Login</el-button>
          </el-form-item>
          <router-link to="/register">Click here to register</router-link>
        </el-form>
      </el-col>
    </el-row>
      Use these <br>
      email: nikoTestUser@nikosad.cdasda <br>
      password: 123456
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formInline: {
        email: null,
        password: null
      },
      errors: null
    };
  },
  methods: {
    async login() {
      const user = {
        email: this.formInline.email,
        password: this.formInline.password,
      };
      await axios
        .post(`${process.env.VUE_APP_BASE_URL_API}/api/user/login`, user, {
          withCredentials: true,
        })
        .then((response) => {
          this.$cookies.set("jwt", response.data.token);
          this.$store.commit('logIn', response.data)
          this.$router.push("/");
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.errors = err.response.data.message
          } else {
            this.errors = "Something went wrong..."
          }
        })
    },
  },
};
</script>

<style lang="scss" scoped>
p{
  color: red;
}
.pb-2{
  padding-bottom: 15px;
}
.template {
  height: 80vh;
}
.RegisterForm{
   margin-top: 12%;
}
.mt-1{
  margin-top: 10px;
}
</style>