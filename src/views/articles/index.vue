<template>
  <el-card class="articles">
      <bread-crumb slot="header">
      <template slot="title">内容列表</template>
      </bread-crumb>
      <!-- el-row 行 -->
      <el-row class="searchtool">
          <el-col :span="2">
           <span>文章状态</span>
          </el-col>
          <el-col :span="18">
              <!-- 0-草稿 1-待审核 2-审核通过 3-审核失败  不传为全部 -->
              <!-- 单选框组 -->
              <!-- 第一种方式用@change="changeCondition" 第二种用watch监听 -->
            <el-radio-group @change="changeCondition"  v-model="formData.status">
                <!-- 全部这个5是默认的，在传参的时候判断一下 是不是5 如果是 就传个null -->
              <el-radio :label="5">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="3">审核失败</el-radio>
              <el-radio :label="2">审核通过</el-radio>
            </el-radio-group>
          </el-col>

      </el-row>
      <el-row class="searchtool">
          <el-col :span="2">
              <span>频道列表</span>
          </el-col>
          <el-col :span="18">
            <el-select v-model="formData.channel_id">
               <!-- 循环生成多个el-option
              lable指的是el-option显示值
              value指的是 el-option的存储值-->
                <el-option  v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
      </el-row>
      <el-row class="searchtool">
           <el-col :span="2">
              <span>时间选择</span>
          </el-col>
            <el-col :span="18">
            <el-date-picker
             value-format="yyyy-MM-dd"
             v-model="formData.dateRange"
             type="daterange"
             range-separator="-"
             start-placeholder="开始日期"
             end-placeholder="结束日期"
            >
             </el-date-picker>
          </el-col>
      </el-row>
     <el-row class="total">
          <!-- 主体 -->
      <span>共找到{{page.total}}条内容</span>
     </el-row>
     <!-- 循环的模板 -->
     <el-row v-for="item in list" :key="item.id.toString()" class="article-item" type="flex" justify="space-between">
         <!-- 左侧 -->
         <el-col :span="14">
             <el-row type="flex">
                 <img :src="item.cover.images.length ? item.cover.images[0] : defaultImg" alt="">
             <div class="info">
                 <span>{{item.title}}</span>
                 <!-- 过滤器不但可以在插值表达式中使用，还可以在v-bind表达式中使用 -->
                 <el-tag :type="item.status | filterType" class="tag">{{item.status | filterStatus}}</el-tag>
                 <span class="date">{{item.pubdate}}</span>
             </div>
             </el-row>

         </el-col>
         <!-- 右侧 -->
         <el-col :span="6">
             <el-row class="right" type="flex" justify="end">
                 <span @click="toModify(item.id)"><i class="el-icon-edit"></i>修改</span>
                 <span @click="delArticle(item.id)"><i class="el-icon-delete"></i>删除</span>
             </el-row>
         </el-col>
     </el-row>
    <!-- 分页组件 -->
    <el-row type="flex" justify="center" align="middle" style="height:60px">
     <!-- 第一种方式用@change="changeCondition" 第二种用watch监听 -->
      <el-pagination
      background
      layout="prev,pager,next"
      :total="page.total"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      @current-change="changePage"
     >

      </el-pagination>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        status: 5, // 状态
        channel_id: null, // 默认是空
        dateRange: [] // 默认为空数组
      },
      channels: [], // 定义一个channels接收频道
      list: [], // 接收文章列表数据
      defaultImg: require('../../assets/img/5.jpg'),
      page: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 文章在每页显示条数
        total: 0 // 文章条数
      }
    }
  },
  filters: {
    // 处理显示状态
    filterStatus (value) {
      // value是过滤器前面表达式计算得到的值
      switch (value) {
        case 0:
          return '草稿'
        case 1:
          return '待审核'
        case 2:
          return '已发表'
        case 3:
          return '审核失败'
      }
    },
    filterType (value) {
      // value是过滤器前面表达式计算得到的值
      switch (value) {
        case 0:
          return 'warning'
        case 1:
          return 'info'
        case 2:
          return ''
        case 3:
          return 'danger'
      }
    }
  },
  methods: {
    // 修改文章
    toModify (id) {
      this.$router.push(`/home/publish/${id.toString()}`)// 到发布页面
    },
    // 删除文章
    delArticle (id) {
      this.$confirm('是否删除文章').then(() => {
        // 直接删除
        this.$axios({
          method: 'delete',
          url: `/articles/${id.toString()}`
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除文章成功'
          })
          this.getConditionArticle()
        })
      })
    },
    // 改变页码事件
    changePage (newPage) {
      // 赋值当前页码
      debugger
      this.page.currentPage = newPage// 赋值当前页
      this.getConditionArticle()
    },
    // 改变条件
    changeCondition () {
      // 组装条件
      this.page.currentPage = 1 // 强制将当前的页码回到第一页
      // 最新状态
      this.getConditionArticle()
    },
    getConditionArticle () {
      let params = {
        page: this.page.currentPage, // 分页信息
        per_page: this.page.pageSize, // 分页信息
        status: this.formData.status === 5 ? null : this.formData.status, // 不传为全部，2代表全部
        channel_id: this.formData.channel_id, // 频道
        begin_pubdate: this.formData.dateRange.length ? this.formData.dateRange[0] : null, // 起始时间
        ebd_pubdate: this.formData.dateRange.length > 1 ? this.formData.dateRange[1] : null // 截止时间
      }
      this.getArticles(params)
    },
    // 获取频道
    getChannels () {
      this.$axios({
        url: '/channels'
      }).then(result => {
        this.channels = result.data.channels // 获取频道数据
      })
    },
    // 获取文章列表数据
    getArticles (params) {
      this.$axios({
        url: '/articles', // 接受地址
        params
      }).then(result => {
        this.list = result.data.results // 接受文章列表数据
        this.page.total = result.data.total_count // 文章总数
      })
    }
  },
  created () {
    this.getChannels()// 调用获取频道数据
    this.getArticles()// 调用获取文章列表
  }
}
</script>

<style lang='less' scoped>
.articles{
    .searchtool{
        height: 60px;
        padding-left:70px;
    }
    .total {
        margin:40px 0px;
        height: 40px;
        border-bottom: 1px dashed #ccc;
    }
    .article-item{
        margin: 20px 0px;
        padding: 10px 0px;
        border-bottom: 1px solid #f2f3f5;
        img{
            width: 180px;
            height: 100px;
            margin-right: 10px;
            border-radius: 4px;
        }
        .info{
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .tag{
            max-width: 60px;
            }
            .date{
                color:#999;
                font-size: 12px;
            }
        }
        .right{
            span{
                margin-left: 10px;
                font-size: 13px;
                margin-top: 9px;
                cursor: pointer;
            }
        }
    }
}
</style>
