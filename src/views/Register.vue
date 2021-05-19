<template>
  <div class="template">
    <el-row justify="center" align="middle" type="flex">
      <el-col :span="7">
        <div id="login">
          <h2>Register Account</h2>
          <el-form :model="formInline" class="mt-2" ref="formInline">
            <span id="inputName">E-mail</span>
            <el-form-item
              class="mt-1"
              prop="email"
              :rules="[{ required: true, message: 'Email is required' }]"
            >
              <el-input
                placeholder="E-mail"
                v-model="formInline.email"
                @keydown.space.prevent
                @paste.prevent
                maxlength="40"
                minlength="6"
                type="email"
                name="email"
                @input="isEmailValid"
              />
            </el-form-item>
            <span id="inputName">Username</span>
            <el-form-item
              class="mt-1"
              prop="username"
              :rules="[{ required: true, message: 'Username is required' }]"
            >
              <el-input
                placeholder="Username"
                v-model="formInline.username"
                @keydown.space.prevent
                @paste.prevent
                maxlength="30"
                minlength="6"
                type="text"
                name="username"
              />
            </el-form-item>
            <span id="inputName">Password</span>
            <el-form-item
              class="mt-1"
              prop="password"
              :rules="[{ required: true, message: 'Password is required' }]"
            >
              <el-input
                v-model="formInline.password"
                @keydown.space.prevent
                @paste.prevent
                type="password"
                maxlength="30"
                minlength="6"
                show-password
                placeholder="Password"
              />
            </el-form-item>
            <p v-if="errors" class="pb-2">
              {{ errors }}
            </p>
            <div class="pb-2" v-if="!isEmailValid()">
              <p id="email">
                Enter a valid email address (format: xxx@xxx.xxx)
              </p>
            </div>
            <el-form-item>
              <el-button type="primary" @click="validateRegister('formInline')"
                >Register</el-button
              >
            </el-form-item>
            <router-link id="register" to="/login"
              >Click here to login</router-link
            >
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
        username: null,
        password: null,
        reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      },
      errors: null,
    };
  },
  methods: {
    isEmailValid: function() {
      return this.formInline.email == ""
        ? ""
        : this.formInline.reg.test(this.formInline.email)
        ? true
        : false;
    },

    validateRegister(email) {
      this.$refs[email].validate((valid) => {
        if (valid) {
          this.isEmailValid();
          if (this.isEmailValid() === true) {
            this.register();
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    },
    async register() {
      const user = {
        username: this.formInline.username,
        email: this.formInline.email,
        password: this.formInline.password,
      };
      await axios
        .post(`${process.env.VUE_APP_BASE_URL_API}/api/user/register`, user)
        .catch((err) => {
          this.errors = err.response.data.error;
        })
        .then((response) => {
          if (response.status === 200) {
            this.RegisterSuccess(), this.$router.push({ path: "login" });
          } else {
            return false;
          }
        });
    },
    RegisterSuccess() {
      this.$notify({
        title: "Register Success",
        message: "Now you can Login into the application!",
        type: "success",
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
      padding-bottom: 5px;
    }
    p {
      color: red;
    }
  }
}
.mt-1 {
  margin-top: 10px;
}
.mt-2 {
  margin-top: 15px;
}
.pb-2 {
  padding-bottom: 15px;
}
</style>
