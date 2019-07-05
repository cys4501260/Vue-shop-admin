<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 步骤条 -->
    <el-steps class="steps" :active="active" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>

    <!-- 主体信息 -->
    <el-tabs tab-position="left" style="margin-top: 20px" @tab-click="changeTab" v-model="tabValue">
      <el-tab-pane label="基本信息">
        <el-form ref="form" :model="addGoodsData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addGoodsData.goods_classify"
              :options="classifyData"
              :props="defaultProps">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <template>
              <el-radio v-model="addGoodsData.is_promote" label="1">是</el-radio>
              <el-radio v-model="addGoodsData.is_promote" label="0">否</el-radio>
            </template>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="nextTab(1, 2)">下一步</el-button>
      </el-tab-pane>
      <!-- 商品图片 -->
      <el-tab-pane label="商品图片">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-success="uploadPicSuccess"
          list-type="picture-card">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="nextTab(2, 3)">下一步</el-button>
      </el-tab-pane>
      <!-- 商品内容,描述信息 -->
      <el-tab-pane label="商品内容">
        <quill-editor
          v-model="addGoodsData.goods_introduce">
        </quill-editor>
        <el-button type="primary" @click="addGoodsInfo">完成</el-button>
      </el-tab-pane>
    </el-tabs>
    
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  
  data() {
    return {
      // 进度
      tabValue: 0,
      active: 0,

      // 选中的分类
      goodsClassifyData: {
        selectClassify: []
      },

      // 分类数据
      classifyData: [],
      // 默认的prop
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
      },

      // 要添加的商品信息
      addGoodsData: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        is_promote: "0",
        goods_classify: [],
        pics: [],
        goods_introduce: ''
      },

      // 图片上传的请求头
      headers: {
        Authorization: localStorage.getItem("token")
      }

    }
  },

  methods: {
    // 点击显示对应的步数
    changeTab(nowTab) {
      console.log(nowTab.index)
      this.active = +nowTab.index
    },
    // 下一步按钮事件
    nextTab(num1, num2) {
      this.tabValue = num1 + ''
      this.active = num2
    },

    // 图片上传成功时的钩子
    uploadPicSuccess(response) {
      this.addGoodsData.pics.push({
        pic: response.data.tmp_path
      })
    },

    // 提交商品信息
    async addGoodsInfo() {
      let res = await this.$http({
        url: 'goods',
        method: 'post',
        data: {
          goods_cat: this.addGoodsData.goods_classify.join(),
          goods_name: this.addGoodsData.goods_name,
          goods_price: this.addGoodsData.goods_price,
          goods_number: this.addGoodsData.goods_number,
          goods_weight: this.addGoodsData.goods_weight,
          goods_introduce: this.addGoodsData.goods_introduce,
          pics: this.addGoodsData.pics,
          is_promote: this.addGoodsData.is_promote
        }
      })

      console.log(res)
      if(res.data.meta.status === 201) {
        this.$router.push('/goods')
      }
    }

  },

  async created() {
    let res = await this.$http({
      url: "categories",
      params: {
        type: 3
      }
    })
    // console.log(res)
    this.classifyData = res.data.data
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

  .steps {
    margin-top: 10px;
  }

</style>

<style>
  .ql-editor {
    height: 200px;
  }
</style>
