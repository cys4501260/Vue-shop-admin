<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <el-row type="flex" class="row-bg" justify="space-between" align="middle">
        <el-col :span="6" class="left">
          <img src="../assets/logo.png" alt="">
        </el-col>
        <el-col class="center">
          品优购后台管理系统
        </el-col>
        <el-col :span="6" class="right">
          欢迎39期星耀会员 <a href="javascript:;" @click="loginOut">退出</a>
          </el-col>
      </el-row>
    </el-header>

  <!-- 主体部分 -->
  <el-container>
    <!-- 左侧列表展示 -->
    <el-aside width="200px">
      <el-menu
        :default-active="$router.path"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :unique-opened="true"
        :router="true"
        >
        <el-submenu v-for="menu1 in leftListData" :key="menu1.id" :index="menu1.id + ''" >
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{menu1.authName}}</span>
          </template>
          <el-menu-item v-for="menu2 in menu1.children" :key="menu2.id" :index="'/' + menu2.path">
            <i class="el-icon-menu"></i>
            <span>{{menu2.authName}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <!-- 右侧主体内容展示 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
  data() {
    return {
      leftListData: []
    }
  },
  methods: {
    loginOut() {
      // 清除token
      localStorage.removeItem('token')
      // 跳转回登录页
      this.$router.push('/login')
    }
  },

  async created() {
    // 根据登录的用户展示对应左侧管理列表
    let res = await this.$http({
      url: `menus`
    })

    this.leftListData = res.data.data
    
  }

}
</script>

<style lang="less" scoped>
  // 头部
  .el-header {
    background-color: #b3c1cd;
    padding: 0;

    .left {

      img {
        width: 200px;
      }
    }

    .center {
      text-align: center;
      color: #fff;
      font-size: 28px;
      font-weight: 700;
    }

    .right {
      text-align: right;
      color: #000;
      font-weight: 700;
      padding-right: 20px;

      a {
        color: orange;
      }
    }

  }

  // 左侧导航栏
  .el-container {
    height: 100%;

    .el-menu-vertical-demo.el-menu {
      height: 100%;
    }

  }
  
</style>
