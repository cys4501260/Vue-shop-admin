<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加按钮 -->
    <el-button type="success" class="addGoods" plain @click="showAddClassify">添加分类</el-button>

    <!-- 主题表格部分 -->
    <el-table
      :data="goodsClassifyData"
      stripe
      style="width: 100%">
      <!-- 树形表格 -->
      <el-table-tree-column 
        folder-icon="el-icon-folder" 
        file-icon="el-icon-document" 
        prop="cat_name" 
        label="分类名称" 
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indent-size="30"
        width="220px">
      </el-table-tree-column>

      <el-table-column
        label="是否有效"
        width="120px">
        <template v-slot="{row}">
          {{row.cat_deleted ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="层级">
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="pageChange"
      :total="total">
    </el-pagination>

    <!-- 添加分类模态框 -->
    <el-dialog title="添加分类" :visible.sync="isAddClassifyShow">
      <el-form :model="addFromData" label-width="100px">
        <el-form-item label="分类名称">
          <el-input  autocomplete="off" v-model="addFromData.inputClassify"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <!-- 将选定的分类保存到下来 -->
          <el-cascader
            v-model="addFromData.selectClassify"
            :options="addClassifyData"
            :props="defaultProps">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClassifyBtn">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
// 使用第三方表格插件 element-tree-grid
// 引入该插件
const ELTreeGrid = require("element-tree-grid")

export default {
  data() {
    return {
      // 显示的页数,条数
      pagenum: 1,
      pagesize: 5,
      total: 0,

      // 列表数据
      goodsClassifyData: [],

      // 模态框显示隐藏
      isAddClassifyShow: false,

      // 表单绑定的数据
      addFromData: {
        // 输入的类名
        inputClassify: '',
        // 选中的分类
        selectClassify: [],
      },

      // 分类选择框绑定的数据
      addClassifyData: [],
      // 默认prop配置
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
      
    }
  },

  // 局部注册组件
  components: {
    [ELTreeGrid.name]: ELTreeGrid
  },

  methods: {
    async getGoodsClassify() {
      let res = await this.$http({
        url: 'categories',
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      this.goodsClassifyData = res.data.data.result
      this.total = res.data.data.total
      
    },

    // 切换页数
    pageChange(currentPage) {
      this.pagenum = currentPage
      this.getGoodsClassify()
    },

    // 显示模态框
    async showAddClassify() {

      let res = await this.$http({
        url: 'categories',
        // 最多只会添加到2级分类里生成三级分类,所以只获取到2级分类
        params: {
          type: 2
        }
      })

      // console.log(res.data.data)
      this.addClassifyData = res.data.data
      this.isAddClassifyShow = true
      
    },

    // 添加分类
    async addClassifyBtn() {
      let res = await this.$http({
        url: 'categories',
        method: 'post',
        data: {
          cat_pid: this.addFromData.selectClassify.pop() || 0,
          cat_name: this.addFromData.inputClassify,
          cat_level: this.addFromData.selectClassify.length + 1
        }
      })

      console.log(res)
      if(res.data.meta.status === 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        })

        this.isAddClassifyShow = false

        this.getGoodsClassify()

        // 清空表单数据
        this.addFromData.inputClassify = ''
        this.addFromData.selectClassify = ''
        
      }
      
    }

  },

  created() {
    this.getGoodsClassify()
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

  .addGoods {
    margin-top: 10px;
  }
  
</style>