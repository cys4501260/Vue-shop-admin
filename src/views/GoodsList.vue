<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加按钮 -->
    <el-button type="success" class="addGoods" plain>添加商品</el-button>

    <!-- 主题表格部分 -->
    <el-table
      :data="goodsListData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间">
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
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsListData: [],
      pagenum: 1,
      pagesize: 6,
      total: 0
    }
  },

  methods: {
    async getGoodsListData() {
      let res = await this.$http({
        url: `goods`,
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })

      console.log(res)
      this.goodsListData = res.data.data.goods
      this.total = res.data.data.total
    },
    
    pageChange(currentPage) {
      this.pagenum = currentPage
      this.getGoodsListData()
    }
  },
  
  created() {
    this.getGoodsListData()
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