<template>
<!-- 整个登录表单 flex布局 -->
  <el-row type="flex" class="row-bg" justify="center" align="middle">

    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <div class="grid-content">
        <el-form ref="loginForm" :model="form" label-position="top" label-width="80px" :rules="rules">
          <!-- 账号密码输入框 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <!-- 登录、重置 按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>

  </el-row>

</template>

<script>

// 导入axios
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',

        username: 'admin',
        password: '123456'
      },

      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'change' }
        ],

        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'change' }
        ],
      }

    }
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            url: 'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: {
              username: this.form.username,
              password: this.form.password
            }
          }).then(({data: {data, meta}}) => {
            console.log(data, meta)
            if(meta.status === 200) {
              localStorage.setItem('token', data.token)

              // js跳转页面
              this.$router.push('/home')
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
}
</script>

<style scoped>
  /* 设置网页的高,使登录框居中 */
  .row-bg {
    height: 100%;
    background-color: #2D434C;
  }

  .grid-content {
    background-color: #fff;
    border-radius: 10px;
    padding: 30px 20px;
    min-width: 400px;
  }
</style>