<template>
  <div>

    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <!-- gutter: 设置栅栏间隔:col与col之间的间隔 -->
   <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <!-- 注册事件的时候后面的.native修饰符的作用是将事件变为dom对象中的事件,不在让事件经过vue处理 -->
          <el-input placeholder="请输入内容" class="input-with-select" v-model="keyWord" @keyup.enter.native="searchUserList">
          <el-button slot="append" icon="el-icon-search" @click="searchUserList"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
   </el-row>
    
    <!-- 主体用户列表 -->
    <el-table
      :data="users"
      stripe
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserStatus(row)"
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 使用模板,为了能用作用域插槽,而拿到我们要的对应数据 -->
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="delUser(row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="currentChange"
      >
    </el-pagination>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      users: [],
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keyWord: "",
    }
  },
  created() {
    this.getUserList()
  },

  methods: {
    getUserList() {
      axios({
      url: 'http://localhost:8888/api/private/v1/users',
      method: 'get',
      params: {
        // 可填,用来查询符合的参数值
        query: this.keyWord,
        pagenum: this.currentpage,
        pagesize: this.pagesize,
      },
      // 必须要将头部的token发送过去,必须保证登录才能接收到数据
      headers: {
        "Authorization": localStorage.getItem('token')
      }
      }).then(res  => {
        console.log(res)
        this.users = res.data.data.users
        // 获取用户个数
        this.total = res.data.data.total
      })
    },

    // 分页当前页改变
    currentChange(page) {
      // 回调参数是当前页数
      this.currentpage = page
      // 重新渲染
      this.getUserList()
    },

    // 切换用户状态
    changeUserStatus(row) {
      axios({
        url: `http://localhost:8888/api/private/v1/users/${row.id}/state/${row.mg_state}`,
        method: 'put',
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      }).then(res  => {
        if(res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success',
            duration: 1000
          });
        }
      }).catch(res  => {
        this.$message({
          message: res.data.meta.msg,
          type: 'error',
          duration: 1000
        });
      })
    },

    // 搜索功能
    searchUserList() {
      // 在获取用户列表时有一个query参数,设置得就是查询参数,自动返回查询到的参数
      // 点击搜索按钮只是将得到的搜素结果再渲染到页面
      this.getUserList()
    },

    // 删除用户功能
    delUser(id) {
      axios({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: 'delete',
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      }).then(res  => {
        if(res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });

          this.currentpage = 1
          this.getUserList()
        }
      }).catch(res  => {
        this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
      })
    },

  }
}
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    background-color: #d4dae0;
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    padding-left: 10px;
  }
</style>

