<template>
  <div>
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
            v-model="row.type"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        <el-button type="success" icon="el-icon-check" size="mini" plain>分配角色</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      users: []
    }
  },
  created() {
    axios({
      url: 'http://localhost:8888/api/private/v1/users',
      method: 'get',
      params: {
        pagenum: 1,
        pagesize: 5
      },
      // 必须要将头部的token发送过去,必须保证登录才能接收到数据
      headers: {
        "Authorization": localStorage.getItem('token')
      }
      
    }).then(res  => {
      this.users = res.data.data.users
    })
  }
}
</script>

<style lang="less" scoped>

</style>

