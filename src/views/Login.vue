<template>
  <div class="template">
    <el-row justify="center" align="middle" type="flex">
      <el-col :span="7">
        <div id="login">
          <h2>Login</h2>
          <el-form :model="formInline" class="mt-1">
            <el-form-item>
              <span id="inputName">E-mail</span>
              <el-input
                placeholder="E-mail"
                v-model="formInline.email"
                type="text"
                name="username"
              />
            </el-form-item>
            <el-form-item>
              <span id="inputName">Password</span>
              <el-input
                v-model="formInline.password"
                type="password"
                show-password
                placeholder="Password"
              />
            </el-form-item>
            <el-form-item>
              <p class="pb-2">
                {{ errors }}
              </p>
              <el-button type="primary" @click="login">Login</el-button>
            </el-form-item>
            <router-link id="register" to="/register">Create new account</router-link>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formInline: {
        email: null,
        password: null,
      },
      errors: null,
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
          this.$store.commit("logIn", response.data);
          this.$router.push("/");
        })
        .catch((err) => {
          if (err.response.status === 400) {
            this.errors = err.response.data.message;
          } else {
            this.errors = "Something went wrong...";
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  color: #8112ea;
}

.template {
  background-color: #191a1f;
  height: 100vh;

  #login {
    font-size: 18px;
    background-color: #121318;
    margin-top: 42%;
    border: 1px solid #8112ea;
    padding: 20px;
    #register {
    text-decoration: none;
    border-bottom: 1px solid #8112ea;
    }
    #inputName {
    font-size: 16px;
    font-weight: 500;
    }
    p {
    color: red;
    }
  }
}
.mt-1 {
  margin-top: 10px;
}
.pb-2 {
  padding-bottom: 15px;
}
</style>
