<template>
  <div class="ds-moudle">
    <el-row :gutter="20" class="ds-moudle-hd">
      <el-col :span="24">
        <el-button @click="createMediaHandle">新建媒体</el-button> 
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
        prop="cmsSwiperMediaName"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="cmsSwiperMediaUrl"
        label="图片">
      </el-table-column>
      <el-table-column
        prop="cmsSwiperMediaLink"
        label="链接">
      </el-table-column>
      <el-table-column
        prop="cmsSwiperMediaDescription"
        label="描述">
      </el-table-column>
<!--       <el-table-column
        prop="date"
        label="创建时间"
        width="120">
      </el-table-column> -->
      <el-table-column
        label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="onEditorHandle(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="onDeleteRow(scope.$index, scope.row)">删除</el-button>
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
          <el-form-item label="标题" prop="cmsSwiperMediaName">
            <el-input v-model="ruleForm.cmsSwiperMediaName" placeholder="请输入标题"></el-input>
          </el-form-item>

          <el-form-item label="链接地址" prop="cmsSwiperMediaLink">
            <el-input placeholder="请输入链接地址" v-model="ruleForm.cmsSwiperMediaLink"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cmsSwiperMediaUrl">
            <el-input placeholder="请输入链接地址" v-model="ruleForm.cmsSwiperMediaUrl"></el-input>
<!--             <el-upload
              class="ds-avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.cmsSwiperMediaUrl" :src="ruleForm.cmsSwiperMediaUrl" class="ds-avatar">
              <i v-else class="el-icon-plus ds-avatar-uploader-icon"></i>
            </el-upload> -->
          </el-form-item>
          <el-form-item label="简介" prop="cmsSwiperMediaDescription">
            <el-input type="textarea" :rows="3" placeholder="请输入图集的简介" v-model="ruleForm.cmsSwiperMediaDescription"></el-input>
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
    getSwiperMediaPage, 
    createSwiperMedia, 
    putSwiperMedia, 
    deleteSwiperMedia } from '@/api/'
  export default {

    data() {
      return {
        dialog: {
          title: '新建媒体',
          visible: false
        },
        pagination: {
          total: 1,
          pageNum: 1,
          pageSize: 10
        },
        cmsSwiperId: '',
        submitLoading: false,
        isEditorStatus: false,
        tableData: [],
      ruleForm: {
        "cmsSwiperMediaName": "",
        "cmsSwiperMediaType": 0,
        "cmsSwiperMediaLink": "",
        "cmsSwiperMediaUrl": "",
        "cmsSwiperMediaDescription": "",
        "cmsSwiperMediaId": ""
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
    // watch: {
    //   '$route'(to, from){
    //     this.getMedia(to)
    //   }
    // },
    created(res){

      var _self = this, $route = this.$route
      console.log($route)
      if($route.params.sid) {
        _self.cmsSwiperId = $route.params.sid
        _self.getSwiperMediaPageHandle(1, 10, $route.params.sid)

      }
      
    },

    methods: {
      submitForm(formName){
        var _self = this
        _self.onRuleForm(formName, function(){

          if(_self.isEditorStatus) {
            _self.putSwiperMediaHandle(_self.ruleForm)
            .then(function(status){
              if(status) {
                _self.getSwiperMediaPageHandle(1, _self.pagination.pageSize, _self.ruleForm.cmsSwiperId)
                _self.submitLoading = false
                _self.dialog.visible = false

              }
            })
            console.log('我在编辑呢')

          }else {
            _self.createSwiperMediaHandle(_self.ruleForm)
            .then(function(status){
              if(status) {
                _self.submitLoading = false
                _self.dialog.visible = false
                _self.getSwiperMediaPageHandle(_self.pagination.pageNum, _self.pagination.pageSize, _self.ruleForm.cmsSwiperId)
              }
            })
          }
                    
        })

      },
      createSwiperMediaHandle(ruleForm){
        var _self = this 
        var data = _self.formartData()
        console.log('这将会是1个是',data)
        // return 
        return createSwiperMedia(data)
        .then(function(res){
          return true
        }).catch(function(){
          return false
        })
      },
      formartData(){
        var _self = this , ruleForm = _self.ruleForm;

        console.log('adasd', ruleForm)
        var data = {
          "cmsSwiperMediaName": ruleForm.cmsSwiperMediaName,
          "cmsSwiperMediaUrl": ruleForm.cmsSwiperMediaUrl,
          "cmsSwiperMediaDescription": ruleForm.cmsSwiperMediaDescription,
          "cmsSwiperMediaId": ruleForm.cmsSwiperMediaId,
          "cmsSwiperMediaLink": ruleForm.cmsSwiperMediaLink,
          "cmsSwiperMediaType": ruleForm.cmsSwiperMediaType
        }

        return data
      },
      putSwiperMediaHandle(ruleForm){
        var _self = this
        
        return putSwiperMedia({
          "courseCategoryLevel": ruleForm.courseCategoryLevel,
          "courseCategoryParentId": ruleForm.courseCategoryParentId,
          "courseCategoryDescription": ruleForm.courseCategoryDescription,
          "courseCategoryEname": ruleForm.courseCategoryEname,
          "courseCategoryId": ruleForm.courseCategoryId,
          "courseCategoryName": ruleForm.courseCategoryName,
          "courseCategoryThumbnailUrl": ruleForm.courseCategoryThumbnailUrl
        }).then(function(res){
          return true
        }).catch(function(){
          return false
        })
      },
      getSwiperMediaPageHandle(pageNum, pageSize, cmsSwiperId){
        var _self = this
        getSwiperMediaPage({
            pageNum: pageNum,
            pageSize: pageSize,
            cmsSwiperId: cmsSwiperId
        }).then(function(data){

          if(!data.list.length){
            _self.tableData = []
          }else {
            _self.tableData = data.list
            _self.pagination.total = parseInt(data.total)
          }
          _self.tableLoading = false
        })

      },
      deleteSwipierMediaHandle(courseCategoryId){
        var _self = this
        return deleteSwiperMedia({
          // "cmsSwiperMediaId": cmsSwiperMediaId,
          id: courseCategoryId
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
        _self.dialog.title = "编辑媒体"
        
        ruleForm.cmsSwiperMediaName = row.cmsSwiperMediaName
        ruleForm.cmsSwiperMediaUrl = row.cmsSwiperMediaUrl
        ruleForm.cmsSwiperMediaId = row.cmsSwiperMediaId
        ruleForm.cmsSwiperMediaDescription = row.cmsSwiperMediaDescription
        ruleForm.cmsSwiperMediaLink = row.cmsSwiperMediaLink
        ruleForm.cmsSwiperMediaType = row.cmsSwiperMediaType
      },
      createMediaHandle(){
        this.dialog.visible = true
        this.dialog.title = "新建媒体"
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
        _self.deleteSwipierMediaHandle(row.cmsSwiperMediaId)
        .then(function(status){
            if(status){
              // rows.splice(index, 1);
              _self.getSwiperMediaPageHandle(1, _self.pagination.pageSize, _self.ruleForm.cmsSwiperId)
            }            
          })
        });
      },
      toMediaRouter(sid){
        var _self = this

        _self.$router.push({name: 'GalleryMedia', params: { sid: sid } })
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