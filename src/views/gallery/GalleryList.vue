<template>
  <div class="ds-moudle">
    <el-row :gutter="20" class="ds-moudle-hd">
      <el-col :span="24">
        <el-button @click="onAddUserHandle">新建图集</el-button> 
      </el-col> 
    </el-row>
     <el-table
      :data="tableData"
      width="50%"
      border
      class="ds-table"
      :row-class-name="tableRowClassName">
      <el-table-column
        prop="id"
        label="ID"
        width="60">
      </el-table-column>
      <el-table-column
        prop="cmsSwiperTitle"
        label="标题"
        width="120">
      </el-table-column>
      <el-table-column
        prop="cmsSwiperLocation"
        label="位置"
        width="180">
      </el-table-column>
      <el-table-column
        prop="countMedia"
        label="包含图片"
        width="80">
      </el-table-column>
      <el-table-column
        prop="date"
        label="创建时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop=""
        label="author">
      </el-table-column>
      <el-table-column
      fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="onEditorHandle(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="onDeleteRow(scope.$index, scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="toMediaRouter(scope.row)">新增(修改)图片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="ds-pagination" v-if="pagination.total > 1">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="onChangePagination"
        v-if="pagination.total > pagination.pageSize"
        :total="pagination.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="50%"
      class="ds-dialog"
      :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" style="padding-right: 10px;">
          <el-form-item label="标题" prop="cmsSwiperTitle">
            <el-input v-model="ruleForm.cmsSwiperTitle" placeholder="请输入标题"></el-input>
          </el-form-item>

          <el-form-item label="位置" prop="cmsSwiperLocation">
            <el-input placeholder="请输入该图集所属位置" v-model="ruleForm.cmsSwiperLocation"></el-input>
          </el-form-item>
          <el-form-item label="封面">
            <el-upload
              class="ds-avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.cmsSwiperCoverUrl" :src="ruleForm.cmsSwiperCoverUrl" class="ds-avatar">
              <i v-else class="el-icon-plus ds-avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="简介" prop="cmsSwiperDescription">
            <el-input type="textarea" :rows="3" placeholder="请输入图集的简介" v-model="ruleForm.cmsSwiperDescription"></el-input>
          </el-form-item>
        </el-form>      
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
  import { 
    getSwiperPage, 
    createSwiper, 
    putSwiper, 
    deleteSwiper } from '@/api/'
  export default {

    data() {
      return {
        dialog: {
          title: '新建图集',
          visible: false
        },
        pagination: {
          total: 1,
          pageNum: 1,
          pageSize: 10
        },
        submitLoading: false,
        isEditorStatus: false,
        tableData: [],
      ruleForm: {
        cmsSwiperCoverUrl: '',
        cmsSwiperTitle: '',
        cmsSwiperLocation: '',
        cmsSwiperDescription: '',
        cmsSwiperId: '',
        countMedia: ''
      },
      rules: {
        cmsSwiperTitle: [
          { required: true, message: '请输入图集标题', trigger: 'blur' }
        ],
        cmsSwiperLocation: [{
          required: true, message: '请输入图集所属位置', trigger: 'blur'
        }]
      }

      }
    },
    watch: {
      // '$route'(to, from){
      //   this.categoryChangeHandle(to)
      // }
    },
    created(res){

      var _self = this
      _self.getSwiperPageHandle(1, 10)
    },

    methods: {
      submitForm(formName){
        var _self = this
        _self.onRuleForm(formName, function(){

          if(_self.isEditorStatus) {
            _self.putSwiperHandle(_self.ruleForm)
            .then(function(status){
              if(status) {
                _self.getSwiperPageHandle(1, _self.pagination.pageSize, _self.ruleForm.courseCategoryParentId)
                _self.submitLoading = false
                _self.dialog.visible = false

              }
            })
            console.log('我在编辑呢')

          }else {
            _self.createSwiperHandle(_self.ruleForm)
            .then(function(status){
              if(status) {
                _self.submitLoading = false
                _self.dialog.visible = false
                _self.getSwiperPageHandle(_self.pagination.pageNum, _self.pagination.pageSize, _self.ruleForm.courseCategoryParentId)
              }
            })
          }
                    
        })

      },
      createSwiperHandle(ruleForm){
        var _self = this 

        console.log('这将会是1个是',ruleForm.courseCategoryParentId)
        // return 
        return createSwiper(_self.formartData()).then(function(res){
          return true
        }).catch(function(){
          return false
        })
      },
      formartData(cmsSwiperId){
        var _self = this, ruleForm = _self.ruleForm;
        var data = {
          "cmsSwiperTitle": ruleForm.cmsSwiperTitle,
          "cmsSwiperCoverUrl": ruleForm.cmsSwiperCoverUrl,
          "cmsSwiperLocation": ruleForm.cmsSwiperLocation,
          "cmsSwiperDescription": ruleForm.cmsSwiperDescription,
          "cmsSwiperId": ruleForm.cmsSwiperId,
          "countMedia": ruleForm.countMedia
        }

        return data
      },
      putSwiperHandle(ruleForm){
        var _self = this
        
        return putSwiper(_self.formartData(_self.cmsSwiperId)).then(function(res){
            return true
        }).catch(function(){
          return false
        })
      },
      getSwiperPageHandle(pageNum, pageSize){
        var _self = this
        getSwiperPage({
            pageNum: pageNum,
            pageSize: pageSize
        }).then(function( data ){
          if(!data.list.length){
            console.log('nihaoaaa')
            _self.tableData = []
          }else {
            _self.tableData = data.list
            _self.pagination.total = parseInt(data.total)
          }
          _self.tableLoading = false
        })

      },
      deleteSwipierHandle(id){
        var _self = this
        return deleteSwiper({
          id: id
        }).then(function(res){
          return true
        }).catch(function(){
          return false
        })
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      onEditorHandle(row){
        var _self = this, ruleForm = _self.ruleForm
        _self.dialog.visible = true
        _self.dialog.title = "编辑用户"
        ruleForm.cmsSwiperTitle = row.cmsSwiperTitle
        ruleForm.cmsSwiperCoverUrl = row.cmsSwiperCoverUrl
        ruleForm.cmsSwiperLocation = row.cmsSwiperLocation
        ruleForm.cmsSwiperDescription = row.cmsSwiperDescription
        ruleForm.cmsSwiperId = row.cmsSwiperId
        ruleForm.countMedia = row.countMedia
      },
      onAddUserHandle(){
        this.dialog.visible = true
        this.dialog.title = "添加用户"
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleAvatarSuccess(){

      },
      beforeAvatarUpload(){

      },
      onDeleteRow(index, row) {
        var _self = this
        _self.confirm({}, function(){
          console.log(row)
        _self.deleteSwipierHandle(row.id)
        .then(function(status){
            if(status){
              // rows.splice(index, 1);
              _self.getSwiperPageHandle(1, _self.pagination.pageSize, _self.ruleForm.courseCategoryParentId)
            }            
          })
        });
      },
      toMediaRouter(row){
        var _self = this
        _self.$router.push({name: 'GalleryMedia', params: { sid: row.id } })
      },
      onRuleForm(formName, callback){
        var _self = this
        _self.$refs[formName].validate((valid) => {
          if (valid) {
            _self.submitLoading = true
            callback()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      confirm(options, callback) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          callback()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
      }
    }

  }
</script>

<style>
  .ds-table th {
    text-align: center;
  }
  .ds-moudle {

  }
  .ds-moudle-hd {
    text-align: left;
    margin-bottom: 15px;
  }
  .ds-dialog {

  }
  .ds-dialog .el-dialog__header {
    text-align: left;
  }
</style>