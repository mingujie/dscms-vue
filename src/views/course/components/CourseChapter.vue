<template>
    <div class="ds-course-chapter app-container">
      <el-tabs type="border-card" class="ds-tabs">

      <el-tab-pane label="课件信息">
        <el-row>
            <el-button type="primary" @click="addSection('create')">添加章</el-button>
            <div class="ds-block" style="padding-top: 10px; font-size: 12px; color:#999;">
                注：请先添加课程的章，然后在添加课程的节（只有节才可以设置课件）。
            </div>
<!--             <el-button type="primary" @click="addClass()">添加课件</el-button> -->
        </el-row>

        <div class="block">
            <el-tree
            v-loading="treeLoading"
            :data="courseChapterData"
            node-key="id"
            empty-text="你还没有增加任何课件"
            default-expand-all
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <template>
                <span v-if="data.type == 'chapter'">第{{data.index + 1}}章：{{ node.label }}</span>
                <span v-else>{{data.order}}-{{data.index + 1}}：{{ node.label }}</span>
                </template>
                <span> 
                    <el-button type="text" v-if=
                    "data.type == 'chapter'" class="" @click="addClass(data, 'new')">添加课件</el-button>
                    <template>
                        <el-button v-if="data.type == 'chapter'" type="text" @click="editorChapterHandle(node, data)">编辑 </el-button>
                        <el-button v-else type="text" @click="addClass(data, 'editor')">编辑 </el-button>
                    </template>
                    <el-button type="text" @click="deleteHandle(node, data)">删除</el-button>
                </span>
            </span>
            </el-tree>
        </div>

        <!-- 添加章，编辑章 -->
        <el-dialog title="添加章" :visible.sync="dialog" @close="closedChapterForm('courseChapterForm')" width="50%">
            <el-form class="ds-course-chapter-dialog" :model="courseChapterForm" :rules="courseChapterRules" ref="courseChapterForm"> 
                <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
                    <el-input v-model="courseChapterForm.title" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="dialogloading" @click="chapterFormSubmit('courseChapterForm')">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加课件,编辑课件弹窗 -->
        <el-dialog 
            title="添加课件" 
            :visible.sync="dialogUpload"  
            @close="closedChapterForm('courseSectionForm')" 
            width="700px">
            <div class="add-content">
                 <el-form :model="courseSectionForm" :rules="courseSectionFormRules" ref="courseSectionForm" label-width="100px">
                <div class="head">
                <el-steps align-center :active="stepActive" finish-status="success">
                  <el-step title="选择课件类型"></el-step>
                  <el-step title="设置课件内容"></el-step>
                  <!-- <el-step title="步骤 3"></el-step> -->
                </el-steps>
                </div>
                <div class="middle" v-if="!sectionFromNextStatus">
                    <img src="../../../assets/movie.png" alt="">
                    <p>视频</p>
                </div>
                <div class="middle-form" v-if="sectionFromNextStatus">
                    
                        <el-form-item label="标题" prop="courseSectionTitle">
                            <el-input placeholder="视频标题" v-model="courseSectionForm.courseSectionTitle" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="视频地址" prop="courseSectionVideoUrl">
                            <el-input placeholder="视频播放地址" v-model="courseSectionForm.courseSectionVideoUrl" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="文件ID" prop="courseSectionVideoFileid">
                            <el-input v-model="courseSectionForm.courseSectionVideoFileid" placeholder="腾讯云视频courseSectionVideoFileid" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="视频时间" prop="videoMinute">
                              <el-col :span="5" style="margin-right: 20px;"><el-input v-model="courseSectionForm.videoMinute" auto-complete="off"><template slot="append">分</template></el-input></el-col>
                              <el-col :span="5"><el-input v-model="courseSectionForm.courseSectionVideoSeconds" auto-complete="off"><template slot="append">秒</template></el-input></el-col>
                        </el-form-item>
                   
                </div>
                 </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="!sectionFromNextStatus" @click="sectionFromNextStatus = true">下一步</el-button>
                <el-button type="primary" v-if="sectionFromNextStatus" @click="sectionFromNextStatus = false">上一步</el-button>
                <el-button type="primary" v-if="sectionFromNextStatus" :loading="dialogloading" @click="courseSectionFormHandel('courseSectionForm')">保存</el-button>            </div>
        </el-dialog>
        </el-tab-pane>
      </el-tabs>

    </div>
</template>

<script>
import {
    createCourseSection,
    putCourseSection,
    deleteCourseSection, 
    getCourseSectionList  } from '@/api/section'

import {
    getCourseChapterList,
    createCourseChapter,
    deleteCourseChapter,
    putCourseChapter }  from '@/api/chapter'
export default {
  components: {
  },
  data() {
    return {
        dialogloading: false,
        treeLoading: true,
        input:'',
        stepActive: 0,
        dialog:false,
        dialogUpload: false,
        sectionName: '',
        isEditorStatus: false,
        sectionFromNextStatus:true,
        formLabelWidth: '80px',
        courseChapterForm: {
            title: '',
            courseChapterId: ''
        },
        courseSectionForm: {
            courseSectionTitle: '',
            courseSectionVideoUrl: '',
            courseSectionId: '',
            videoMinute: '',
            courseSectionVideoSeconds: '',
            courseSectionVideoFileid: ''
        },
        currentCourseChapterRow: {},
        courseChapterData: [],
        courseChapterRules:{},
        courseChapterRules: {
            title: [{
                required: true, message: '请输入课程章名', trigger: 'blur'
            }]
        },
        courseSectionFormRules: {
            courseSectionTitle: [{
                required: true, message: '请输入视频名称', trigger: 'blur'
            }],
            // courseSectionVideoUrl: [{
            //     required: true, message: '请上传视频', trigger: 'blur'
            // }]
        }

    }
  },
  // props: {
  //   courseSubjectId: [String]
  // },
  mounted() {  

    // let all = document.querySelectorAll('.el-tree-node__content');
    //     all[all.length - 1].style.borderBottom = '1px solid #ddd' 
    // if(this.courseSubjectId){
    //     this.getCourseChapterListHandle(this.courseSubjectId)
    // }
  },

  computed: {
  },
  created(){
    var route = this.$route
    var courseSubjectId = route.params.cid   
    if(courseSubjectId){
        this.getCourseChapterListHandle(courseSubjectId)
        this.courseSubjectId = courseSubjectId
    }
  },

  methods: {
    getCourseChapterListHandle(courseSubjectId){
        var _self = this;

        getCourseChapterList({
            courseSubjectId: courseSubjectId
        }).then(function(data){
            console.log('课程列表', data)
              if(data && data.length) {
                // console.log(res.data)
                _self.courseChapterData = _self.formartCourseChapterList(data)
              }
              _self.treeLoading = false
              _self.dialogUpload = false
        })
    },
    formartCourseChapterList(data){
        var _self = this
        for(var i=0; i<data.length; i++) {
            data[i].label = data[i].courseChapterTitle
            data[i].type = 'chapter'
            data[i].index = i
            if(data[i].courseSections && data[i].courseSections.length){
                data[i].children = _self.initCourseSectionList(data[i].courseSections, i)
            }
            
        }

        return data
    },
    createCourseChapterHandle(courseSubjectId, title, callback){
        createCourseChapter(courseSubjectId, title)
        .then(function( data ){
            callback(data)
        })
    },
  chapterFormSubmit(formName) {
        var _self = this, title = _self.courseChapterForm.title;
        _self.onRuleForm(formName, function(){
            _self.dialogLoading = true
            if(_self.isEditorStatus) {
                //_self.$set('currentCourseChapterRow', '')
                _self.currentCourseChapterRow.label = title
                _self.putCourseChapterHandle(_self.courseSubjectId, _self.courseChapterForm.courseChapterId, title, function(){
                    _self.dialogLoading = false
                })
            }else {
                var data = _self.formartCourseChapter(title)     
                _self.createCourseChapterHandle(_self.courseSubjectId, title, function(){
                    _self.dialogLoading = false
                    _self.courseChapterData.push(data) 
                })
            }
            _self.dialog = false
            _self.isEditorStatus = false
        })
        
  },
    formartCourseChapter(value){
        var index = this.courseChapterData.length
        var obj = {
            label: value,
            index: index,
            id: index,
            type: 'chapter'
        }
        return obj
    },
    addSection(value) {
        this.dialog = true
        if(value === 'create') {
            this.isEditorStatus = false
            // this.createCourseChapterHandle()
        }
    },
    addClass(data, type) {

        console.log('当前数据',data)
        const _self = this;
        _self.courseChapterForm = data
        _self.dialogUpload = true
        if(type === 'editor') {
            _self.courseSectionForm =  {
                courseSectionTitle: data.courseSectionTitle,
                courseSectionVideoUrl: data.courseSectionVideoUrl,
                courseSectionId: data.courseSectionId,
                videoMinute: '',
                courseSectionVideoSeconds: data.courseSectionVideoSeconds,
                courseSectionVideoFileid: data.courseSectionVideoFileid
            }
        }
    },
    initCourseSectionList( data , index){
        var _self = this
        for(var i=0; i<data.length;i++){
            data[i].label = data[i].courseSectionTitle
            data[i].index = i
            data[i].type = 'section'
            data[i].order = index + 1
        }

        return data
    },
    deleteHandle(node, data){
        var _self = this
        if(data.type === 'chapter') {
            _self.deleteChapterHandle(node, data)
        }else if(data.type === 'section') {
            _self.deleteSectionHandle(node, data)
        }
        console.log('删除数据',data)

    },
    deleteSectionHandle(node, data){
        const _self = this
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        _self.confirm({}, function(){
            deleteCourseSection({
              id: data.id
            }).then(function(res){
                children.splice(index, 1);
                _self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
            })          
        })
    },
    deleteChapterHandle(node, data){
        const _self = this
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        _self.confirm({}, function(){
            deleteCourseChapter(data.id).then(function(res){
                children.splice(index, 1);
                _self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
            })          
        })

    },
    formartCourseSectionData(){
        var _self = this,

            data = {
            "courseSectionId": _self.courseSectionForm.courseSectionId || '',
            "courseChapterId": _self.courseChapterForm.courseChapterId || '',
            "courseSubjectId": _self.courseSubjectId,
            "courseSectionTitle": _self.courseSectionForm.courseSectionTitle || '',
            "courseSectionVideoFileid": _self.courseSectionForm.courseSectionVideoFileid,
            "courseSectionVideoName": "string",
            "courseSectionVideoUrl": _self.courseSectionForm.courseSectionVideoUrl,
            "courseSectionVideoCoverName": "string",
            "courseSectionVideoCoverUrl": "string",
            "courseSectionVideoSeconds": 90
        }
        return data
    },
    createCourseSectionHandle(callback){
        var _self = this;
      createCourseSection(_self.formartCourseSectionData()).then(function(data){
            callback(data)
      })
    },

    editorChapterHandle(node, data){
        var _self = this
        _self.dialog = true
        _self.isEditorStatus = true
        _self.courseChapterForm.title = data.label
        _self.courseChapterForm.courseChapterId = data.courseChapterId
        _self.currentCourseChapterRow = data
    },
    putCourseChapterHandle(courseSubjectId, courseChapterId, courseChapterTitle, callback){
        var _self = this
        putCourseChapter({
            courseSubjectId,
            courseChapterId,
            courseChapterTitle
        }).then(function(data){
            callback(data)
        })
    },
    courseSectionFormHandel(formName){
        var _self = this, courseChapterForm = _self.courseChapterForm
        
        _self.onRuleForm(formName, function(){
            _self.dialogloading = true
            _self.createCourseSectionHandle(function(data){

                _self.getCourseChapterListHandle(_self.courseSubjectId)
                _self.dialogloading = false
                // _self.closedChapterForm(formName)
                // var newData = _self.initCourseSectionList(data, 0)
                // if (!courseChapterForm.children) {
                //   _self.$set(courseChapterForm, 'children', []);
                // }
                // courseChapterForm.children.push(data);

            })

        })
    },
      onRuleForm(formName, callback){
        var _self = this
        _self.$refs[formName].validate((valid) => {
          if (valid) {
            //_self.submitLoading = true
            callback()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      closedChapterForm(formName){

        this.$refs[formName].resetFields();

        if(formName === 'courseChapterForm') {
            this.courseChapterForm = {
                title: '',
                courseChapterId: ''
            }
            //return
        }

        if(formName === 'courseSectionForm') {
            this.courseSectionForm = {
                courseSectionTitle: '',
                courseSectionVideoUrl: '',
                courseSectionId: '',
                videoMinute: '',
                courseSectionVideoSeconds: '',
                courseSectionVideoFileid: '',
                courseSectionVideoName: '',
                courseSectionVideoCoverName: '',
                courseSectionVideoCoverUrl: '',
            }            
        }

        console.log('关闭的回调', this.courseSectionForm)
      },
      confirm(options, callback) {
        this.$confirm('此操作将永久删除该信息，你确定删除吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          callback()
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

<style lang="scss">
    .ds-course-chapter{
        text-align: left;
        .el-steps {
            width: 100%;
        }
        .el-tree {
            border-bottom: 1px solid #ddd;
        }
        .block{
            padding-top: 20px;
            font-size: 18px;
            .el-tree-node__content{
                padding-top: 10px;
                padding-bottom: 10px;
                border: 1px solid #ddd;
                border-bottom: 0;
                display: flex;
                height: 45px;
            }
            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 10px;
            }
            .el-checkbox {
                margin-top: 8px;
            }
        }
        .ds-course-chapter-dialog {
            padding-right: 50px;
        }
        .add-content{
            .head{
                display: flex;
                align-items: center;
                padding-bottom: 50px;
                .head-child{
                    display: flex;
                    align-items: center;
                    width: 45%;
                    justify-content: center;
                    p{
                        width: 40px;
                        height: 40px;
                        text-align: center;
                        line-height: 42px;
                        background: #409EFF;
                        color: #fff;
                        font-size: 28px;
                        border-radius: 50%;
                    }
                    div{
                        margin-left: 20px;
                        font-size: 16px;
                    }
                }
            }
            .middle{
                position: relative;
                background: #ddd;
                width: 140px;
                height: 140px;
                margin-left: 75px;
                margin-top: 20px;
                text-align: center;
                img{
                    width: 40px;
                    height: 40px;
                    margin-top: 40px;
                }
                span{
                    position: relative;
                }
            }
            .middle-form{
                padding-right: 50px;
            }
        }
    }

</style>
