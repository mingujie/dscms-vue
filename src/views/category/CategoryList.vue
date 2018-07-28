<template>
  <div class="ds-moudle">
    <el-row :gutter="20" class="ds-moudle-hd">
      <el-col :span="24">
        <el-button @click="onAddCategoryHandle">{{cateBtnName}}</el-button> 
      </el-col> 
    </el-row>
     <el-table
      :data="tableData"
      v-loading="tableLoading"
      width="50%"
      border
      class="ds-table"
      :row-class-name="tableRowClassName">
      <el-table-column
        prop="id"
        label="分类ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="courseCategoryName"
        label="分类名称（中文）"
        width="180">
      </el-table-column>
      <el-table-column
        prop="courseCategoryEname"
        label="分类名称（英文）"
        width="180">
      </el-table-column>
      <el-table-column
        prop="courseCategoryThumbnailUrl"
        label="缩略图"
        width="120">
          <template slot-scope="scope">
            <div class="table-pic">
              <img v-if="scope.row.courseCategoryThumbnailUrl" :src="scope.row.courseCategoryThumbnailUrl" />
            </div>
          </template>
      </el-table-column>
      <el-table-column
        prop="childCount"
        label="子分类(个)"
        width="160">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="onEditorHandle(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="onDeleteRow(scope.$index, scope.row)">删除</el-button>
          <template v-if="isShowRouter">
            <el-button type="text" size="small" @click="onChangeCategory(scope.row.courseCategoryId)">增(改)子分类</el-button>
          </template>
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
      @closed="closeDialogHandle"
      :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" style="padding-right: 10px;">
          <el-form-item label="中文名称" prop="courseCategoryName">
            <el-input v-model="ruleForm.courseCategoryName" placeholder="请输入中文名称"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" prop="courseCategoryEname">
            <el-input placeholder="请输入英文名称" v-model="ruleForm.courseCategoryEname"></el-input>
          </el-form-item>
          <el-form-item label="缩略图">
            <el-upload
              class="ds-avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.courseCategoryThumbnailUrl" :src="ruleForm.courseCategoryThumbnailUrl" class="ds-avatar">
              <i v-else class="el-icon-plus ds-avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="描述" prop="courseCategoryDescription">
            <el-input type="textarea" :rows="3" placeholder="请输入分类描述" v-model="ruleForm.courseCategoryDescription"></el-input>
          </el-form-item>
        </el-form>      
        <span slot="footer" class="dialog-footer">
        <el-button  @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit('ruleForm')" :loading="submitLoading">确 定</el-button>
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
    getCourseCategoryPage, 
    addCourseCategory,
    deleteCourseCategory,
    putCourseCategory } from '@/api/'

  export default {

    data() {
      return {
        cateBtnName: '新增一级分类',
        routerName: '',
        isShowRouter: true,
        dialog: {
          title: '新增分类',
          visible: false
        },
        tableLoading: true,
        submitLoading: false,
        isEditorStatus: false,
        curEditorRowIndex: 0,
        tableData: [],
      ruleForm: {
        courseCategoryDescription: '',
        courseCategoryEname: '',
        courseCategoryLevel: 0,
        courseCategoryName: '',
        courseCategoryParentId: '',
        courseCategoryThumbnailUrl: '',
        courseCategoryId: ''
      },
      router: {
        cid: ''
      },
      pagination: {
        total: 1,
        pageNum: 1,
        pageSize: 10
      },
      rules: {
        courseCategoryName: [
          { required: true, message: '请输入中文名称', trigger: 'blur' }
        ],
        courseCategoryEname: [
          { required: true, message: '请输入英文名称', trigger: 'blur' }
        ]
      }

      }
    },
    watch: {
      '$route'(to, from){
        this.categoryChangeHandle(to)
      }
    },
    created(res){

      var _self = this
      _self.categoryChangeHandle(this.$route)
    },

    methods: {

      categoryChangeHandle(router){
        var _self = this, 
            cid = '', 
            cateBtnName = '新增分类',
            courseCategoryLevel = 0,
            routerName = "CategorySecond",
            isShowRouter = true;
        if(router.name === 'CategorySecond' && router.params.cid){
          cid = router.params.cid
          cateBtnName = '新增二级分类'
          courseCategoryLevel = 1
          routerName = "CategoryThird"
          isShowRouter = true
        }else if(router.name === 'CategoryThird' && router.params.cid){
          cid = router.params.cid
          cateBtnName = '新增三级分类'
          courseCategoryLevel = 2
          isShowRouter = false
          //routerName = "thirdList"
        }
        _self.cateBtnName = cateBtnName
        _self.ruleForm.courseCategoryLevel  = courseCategoryLevel
        _self.ruleForm.courseCategoryParentId = cid
        _self.routerName = routerName
        _self.isShowRouter = isShowRouter
        _self.$set(_self.router, 'cid', cid)
        _self._getCourseCategoryPage(_self.pagination.pageNum, _self.pagination.pageSize, cid)
      },
      formartRuleForm(){
        var ruleForm = this.ruleForm
        ruleForm.courseCategoryDescription = ''
        ruleForm.courseCategoryEname = ''
        ruleForm.courseCategoryName = ''
        ruleForm.courseCategoryThumbnailUrl = ''
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      closeDialogHandle(){
        var _self = this
        //alert('我会被关闭么')
        _self.$refs['ruleForm'].resetFields();
      },
      _getCourseCategoryPage(pageNum, pageSize, cid){
        var _self = this
        getCourseCategoryPage({
            pageNum: pageNum,
            pageSize: pageSize,
            parentId: cid
        }).then(function( data ){

          if(!data.list.length){

            _self.tableData = []
          }else {
            _self.tableData = data.list
            _self.pagination.total = parseInt(data.total)
          }
          _self.tableLoading = false
        })

      },
      onChangePagination(pageNum){
        var _self = this
        _self._getCourseCategoryPage(pageNum, _self.pagination.pageSize, _self.ruleForm.courseCategoryParentId)
      },
      onEditorHandle(index, row){
        var ruleForm = this.ruleForm
        // ruleForm.courseCategoryId = row.courseCategoryId
        ruleForm.courseCategoryEname = row.courseCategoryEname
        ruleForm.courseCategoryName = row.courseCategoryName
        ruleForm.courseCategoryDescription = row.courseCategoryDescription
        ruleForm.courseCategoryThumbnailUrl =  row.courseCategoryThumbnailUrl
        ruleForm.courseCategoryId = row.courseCategoryId
        this.dialog.title = "编辑分类"
        this.dialog.visible = true
        this.curEditorRowIndex = index
        this.isEditorStatus = true

      },
      onAddCategoryHandle(){
        this.dialog.visible = true
        this.dialog.title = "添加分类"
        this.isEditorStatus = false
        this.formartRuleForm()
      },
      handleClose(done) {
        var _self = this
        _self.$confirm('确认关闭？')
          .then(_ => {
            if(typeof(done) === 'function') {
              done();

            }else {
              _self.dialog.visible = false
            }
            //_self.$refs['ruleForm'].resetFields();
            
          })
          .catch(_ => {});

        //_self.isEditorStatus = false
      },
      handleAvatarSuccess(){

      },
      beforeAvatarUpload(){

      },
      onDeleteRow(index, row) {
        var _self = this
        _self.confirm({}, function(){
        _self._deleteCourseCategoryHandle(row.courseCategoryId)
        .then(function(status, error){
            if(status){
              // rows.splice(index, 1);
              _self._getCourseCategoryPage(1, _self.pagination.pageSize, _self.ruleForm.courseCategoryParentId)
            }            
          })
        });
      },
      onChangeCategory(cid){
        var _self = this

        _self.$router.push({name: _self.routerName, params: { cid: cid } })
      },
      _putCourseCategoryHandle(ruleForm){
        var _self = this
        
        return putCourseCategory({
          "courseCategoryLevel": ruleForm.courseCategoryLevel,
          "courseCategoryParentId": ruleForm.courseCategoryParentId,
          "courseCategoryDescription": ruleForm.courseCategoryDescription,
          "courseCategoryEname": ruleForm.courseCategoryEname,
          "courseCategoryId": ruleForm.courseCategoryId,
          "courseCategoryName": ruleForm.courseCategoryName,
          "courseCategoryThumbnailUrl": ruleForm.courseCategoryThumbnailUrl
        }).then(function(data){
          return true
        }).catch(function(error){
          return false
        })
      },
      _deleteCourseCategoryHandle(courseCategoryId){
        var _self = this
        return deleteCourseCategory({
          "id": courseCategoryId
        }).then(function( data ){
          return true
        }).catch(function(error){
          return false
        })
      },
      _addCourseCategoryHandle(ruleForm){
        var _self = this 

        // return 
        return addCourseCategory({
          "courseCategoryLevel": ruleForm.courseCategoryLevel,
          "courseCategoryParentId": ruleForm.courseCategoryParentId,
          "courseCategoryDescription": ruleForm.courseCategoryDescription,
          "courseCategoryEname": ruleForm.courseCategoryEname,
          "courseCategoryName": ruleForm.courseCategoryName,
          "courseCategoryThumbnailUrl": ruleForm.courseCategoryThumbnailUrl
        }).then(function(res){
          return true
        })
      },
      onSubmit(formName){
        var _self = this

        _self.onRuleForm(formName, function(){

          if(_self.isEditorStatus) {
            _self._putCourseCategoryHandle(_self.ruleForm)
            .then(function(status){
              if(status) {
                _self._getCourseCategoryPage(1, _self.pagination.pageSize, _self.ruleForm.courseCategoryParentId)
                _self.submitLoading = false
                _self.dialog.visible = false

              }
            })


          }else {
            _self._addCourseCategoryHandle(_self.ruleForm)
            .then(function(status){
              if(status) {
                _self.submitLoading = false
                _self.dialog.visible = false
                _self._getCourseCategoryPage(_self.pagination.pageNum, _self.pagination.pageSize, _self.ruleForm.courseCategoryParentId)
              }
            })
          }
                    
        })

        //_self.submitLoading = false
      },
      createCateRow(form){
        var _self = this
        var obj = {
          cid: '',
          cateName: form.name || '',
          scateCount: '',
          tcateCount: '',
          cateThumb: form.thumb || '',
          desc: form.desc || '',
          ename: form.ename || ''
        }

        return obj
      },
      onRuleForm(formName, callback){
        var _self = this
        _self.$refs[formName].validate((valid) => {
          if (valid) {
            _self.submitLoading = true
            callback()
          } else {
            return false;
          }
        });
      },
      confirm(options, callback) {
        this.$confirm('此操作将永久删除该分类及其子分类，你确定删除吗？', '警告', {
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
</style>