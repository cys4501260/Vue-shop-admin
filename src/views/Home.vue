<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="row-bg" justify="space-between" align="middle">
        <el-col :span="6" class="left">
          <img src="../assets/logo.png" alt="">
        </el-col>
        <el-col class="center">
          品优购后台管理系统
        </el-col>
        <el-col :span="6" class="right">
          欢迎39期星耀会员 <a href="#">退出</a>
          </el-col>
      </el-row>
    </el-header>
  <el-container>
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
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/user">
            <i class="el-icon-menu"></i>
            <span>用户管理</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item index="1-1">
            <i class="el-icon-menu"></i>
            <span>校色列表</span>
          </el-menu-item>
          <el-menu-item index="1-1">
            <i class="el-icon-menu"></i>
            <span>权限列表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>商品管理</span>
          </template>
          <el-menu-item index="1-1">
            <i class="el-icon-menu"></i>
            <span>用户管理</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>订单管理</span>
          </template>
          <el-menu-item index="1-1">
            <i class="el-icon-menu"></i>
            <span>用户管理</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>数据统计</span>
          </template>
          <el-menu-item index="1-1">
            <i class="el-icon-menu"></i>
            <span>用户管理</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>

    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
  
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
