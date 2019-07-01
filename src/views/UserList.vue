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
        <el-button type="success" plain @click="addUser">添加用户</el-button>
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
          <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="modifyUser(row.id)"></el-button>
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

    <!-- 添加功能的模态框 -->
    <!-- dislog里面的close是当模态框关闭时触发的回调函数,在里面将表单数据清空 -->
    <el-dialog title="添加用户" :visible.sync="isShowAddUser" @close="$refs.addUserData.resetFields()">
      <el-form :model="addUserForm" :rules="addRules" ref="addUserData">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddUser = false">取 消</el-button>
        <el-button type="primary" @click="addUserData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改功能的模态框 -->
    <el-dialog title="修改用户信息" :visible.sync="isShowModifyUser">
      <el-form :model="modifyUserForm" :rules="modifyRules" ref="modifyUserData">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-tag type="info" v-text="modifyUserForm.username"></el-tag>
        </el-form-item>
        
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="modifyUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="modifyUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowModifyUser = false">取 消</el-button>
        <el-button type="primary" @click="modifyUserData">确 定</el-button>
      </div>
    </el-dialog>

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
      // 添加模态框表单
      // 模态框的显示隐藏
      isShowAddUser: false,
      // 表单的基本信息
      addUserForm: {
        username: "",
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      // 表单的校验规则
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'change' }
        ],
        email: [
          { pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: '邮箱格式不正确', trigger: 'change' },
        ],
        mobile: [
          { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, message: '手机号码格式不正确', trigger: 'change' },
        ]

      },

      // 修改模态框表单
      // 模态框的显示隐藏
      isShowModifyUser: false,
      // 表单的基本信息
      modifyUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      // 表单的校验规则
      modifyRules: {
        
        email: [
          { pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: '邮箱格式不正确', trigger: 'change' },
        ],
        mobile: [
          { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, message: '手机号码格式不正确', trigger: 'change' },
        ]

      },

    }
  },

  // 加载页面的用户列表
  created() {
    this.getUserList()
  },

  methods: {
    // 用户列表数据的获取
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
    async delUser(id) {
      // 删除属于敏感操作,要给用户提示
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

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
        
      } catch (err) {
        console.log('删除失败' + err)
      }
      
    },

    // 显示添加模态框
    addUser() {
      this.isShowAddUser = true
    },
    // 添加功能
    async addUserData() {
      // 点击确定时首先进行表单校验
      try {
        await this.$refs.addUserData.validate()
        console.log('表单校验成功')
        axios({
          url: `http://localhost:8888/api/private/v1/users`,
          method: 'post',
          // 表单绑定的数据
          data: this.addUserForm,
          headers: {
            "Authorization": localStorage.getItem('token')
          }
        }).then(res  => {
          if(res.data.meta.status === 201) {
            this.$message({
              message: res.data.meta.msg,
              type: 'success',
              duration: 1000
            })
            this.getUserList()
            this.isShowAddUser = false
          }
        }).catch(res  => {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        })
        
      } catch (err) {
        console.log('表单校验失败' + err)
      }
      
    },

    // 显示修改模态框
    modifyUser(id) {
      axios({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      }).then(res  => {
        this.modifyUserForm = res.data.data
      })
      this.isShowModifyUser = true
    },
    // 修改功能
    async modifyUserData() {
      try {
        await this.$refs.modifyUserData.validate()
        console.log('表单校验成功')
        axios({
          url: `http://localhost:8888/api/private/v1/users/${this.modifyUserForm.id}`,
          method: 'put',
          // 表单绑定的数据
          data: {
            email: this.modifyUserForm.email,
            mobile: this.modifyUserForm.mobile
          },
          headers: {
            "Authorization": localStorage.getItem('token')
          }
        }).then(res  => {
          if(res.data.meta.status === 200) {
            this.$message({
              message: res.data.meta.msg,
              type: 'success',
              duration: 1000
            })
            this.getUserList()
            this.isShowModifyUser = false
          }
        }).catch(res  => {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        })
        
      } catch (err) {
        console.log('表单校验失败' + err)
      }
    }

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

