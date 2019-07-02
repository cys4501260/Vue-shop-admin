<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体列表 -->
    <el-table
      :data="roleList"
      stripe
      style="width: 100%">
      <!-- 展开内容 -->
      <el-table-column type="expand">
        <template v-slot="{row}">
          <!-- 一级菜单 -->
          <el-row type="flex" class="level1" justify="space-between" v-for="level1 in row.children" :key="level1.id">
            <el-col :span="6">
              <el-tag closable>{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <!-- 二级菜单 -->
              <el-row type="flex" class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="6">
                  <el-tag type="success" closable>{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级菜单 -->
                <el-col>
                  <el-tag type="warning" class="level3" closable v-for="level3 in level2.children" :key="level3.id">{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 表格序号 -->
      <el-table-column
      type="index">
      </el-table-column>
      <!-- 数据展示 -->
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 使用模板,为了能用作用域插槽,而拿到我们要的对应数据 -->
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain @click="showRole(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限列表模态框 -->
    <el-dialog title="角色授权" :visible.sync="isShowRolePermission">
      <el-tree
        ref="rolePermissionTree"
        :data="permissionList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defaultSelect"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowRolePermission = false">取 消</el-button>
        <el-button type="primary" @click="updateRolePermission">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      // 显示/隐藏 角色授权模态框
      isShowRolePermission: false,

      // 默认选中的权限数组
      defaultSelect: [],
      // 权限列表数据
      permissionList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },

      // 对应角色的id
      roleClickId: -1

    }
  },

  // 事件
  methods: {
    // 获取列表数据
    getRoleListData() {
      this.$http({
        url: 'roles',
      }).then(res  => {
        this.roleList = res.data.data
      }).catch (res  => {
        console.log('失败了')
      })
    },

    // 点击显示展开栏数据,并渲染默认选中的权限
    showRole(row) {
      // 保存对应角色的id值
      this.roleClickId = row.id
      
      this.isShowRolePermission = true

      // 获取权限列表
      this.$http({
        url: 'rights/tree'
      }).then(res  => {
        this.permissionList = res.data.data
      })

      // 默认选中数组(通过点击,传入外面对应的行数据,拿到默认的权限)
      console.log(row)
      let level1Ids = []
      let level2Ids = []
      let level3Ids = []

      row.children.forEach(level1  => {
        level1Ids.push(level1.id)
        level1.children.forEach(level2  => {
          level2Ids.push(level2.id)
          level2.children.forEach(level3  => {
            level3Ids.push(level3.id)
          })
        })
      })

      this.defaultSelect = [...level1Ids, ...level2Ids, ...level3Ids]

    },

    // 更新角色的权限
    updateRolePermission() {
      // 通过树形控件自带的事件,拿到现在的选中权限存储到数据中
      let rid =  [...this.$refs.rolePermissionTree.getCheckedKeys(), ...this.$refs.rolePermissionTree.getHalfCheckedKeys()].join(',')

      // 发送请求
      this.$http({
        url: `roles/${this.roleClickId}/rights`,
        method: 'post',
        data: {
          rids: rid
        }
      }).then(res  => {
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })

        // 更新成功重新渲染列表
        this.getRoleListData()

        // 关闭模态框
        this.isShowRolePermission = false
        
      })
    }
    
  },

  // 页面开始加载数据
  created() {
    this.getRoleListData()
  }

};
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

  .level1 {
    border-bottom: 1px dashed #ccc;
    padding: 10px 0;
  }

  .level2 {
    margin-bottom: 10px;
  }

  .level3 {
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
