<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体表格 -->
    <el-table
      :data="permissionList"
      style="width: 100%">
      <!-- 序号列 -->
      <el-table-column
        type="index">
      </el-table-column>

      <el-table-column
        prop="authName"
        label="权限名称"
        width="120px">
      </el-table-column>

      <el-table-column
        prop="path"
        label="路径"
        width="120px">
      </el-table-column>

      <el-table-column
        label="层级">
        <template v-slot="{row}">
          {{row.level | permissionLevel}}
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      permissionList: [],
    }
  },

  filters: {
    permissionLevel(value) {
      if(value === "0") {
        return '一级'
      } else if(value === "1") {
        return '二级'
      } else if (value === "2") {
        return '三级'
      }
    }
  },

  created() {
    this.$http({
      url: 'rights/list',
    }).then(res  => {
      this.permissionList = res.data.data
    })
  }

}
</script>

<style lang="less" scoped>
  // 头部导航栏的样式
  .el-breadcrumb {
    background-color: #d4dae0;
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    padding-left: 10px;
  }
</style>
