<template>
  <div class="class-list-page">
<el-tabs type="border-card"  @tab-click="handleClick">
	<el-row>
		<el-col :span="8">
			<el-input v-model="input" placeholder="请输入内容"></el-input>
		</el-col>
		<el-col :span="16">
			<el-button type="primary">搜索</el-button>
			<el-button type="success">新增课程</el-button>
		</el-col>
	</el-row>

    <el-table
      :data="tableData"
      style="width: 100%"
	  class="table-contain ds-table"	
	  header-cell-class-name="cell-con">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="cate" label="分类"></el-table-column>
      <el-table-column prop="publicTime" label="发布时间"></el-table-column>
      <el-table-column prop="price" label="价格（元）"></el-table-column>
      <el-table-column prop="level" label="等级"></el-table-column>
      <el-table-column prop="teatecher" label="教师"></el-table-column>
      <el-table-column prop="longTime" label="总时长"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
    	<el-table-column
		fixed="right"
		label="操作"
		width="100">
		<template slot-scope="scope">
			<el-button type="text" @click="toDetail">查看</el-button>
<!-- 			<el-button type="text">删除</el-button>
			<el-button type="text">增加课件</el-button> -->
		</template>
	  </el-table-column>
    </el-table>

	<div class="block">
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:current-page="currentPage4"
		:page-sizes="[100, 200, 300, 400]"
		:page-size="100"
		layout="total, sizes, prev, pager, next, jumper"
		:total="400">
    </el-pagination>
  </div>
  <el-tab-pane label="全部"></el-tab-pane>
  <el-tab-pane label="待审核"></el-tab-pane>
  <el-tab-pane label="审核通过"></el-tab-pane>
  <el-tab-pane label="审核未通过"></el-tab-pane>
</el-tabs>

  </div>
</template>

<script>
export default {
  data() {
    return {
		input:'',
		currentPage4: 1,
        tableData: [{
        	id: 111122,
        	title: '你好啊',
        	cate: 'biubiu',
            publicTime: '2016-05-02',
            price: 9.90,
            level: '初级',
            teatecher: '猫猫',
            longTime: '6小时',
            status: '待审核'
          }]
    }
  },

  mounted() {  

  },
  computed: {
  },

  methods: {
		submit() {
			
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
		},
		toDetail() {
			this.$router.push('/class/detail')
		},
		handleClick(tab, event){
			console.log(tab, event)
		}
  }
}
</script>

<style lang="scss">
    .class-list-page{
       .el-col-16{
		   	text-align: left;
			padding-left: 20px;
	   }
	   .table-contain{
		   	margin-top: 20px;
		   	.cell-con{
				text-align: center;
			}
	   }
	   .block{
		   margin-top: 20px;
		   text-align: right;
	   }
    }



</style>
