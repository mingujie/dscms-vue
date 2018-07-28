<template>
    <div class="class-upload-page">
        <el-row>
            <el-button type="primary" @click="addSection('create')">添加章</el-button>
            <div class="ds-block" style="padding-top: 10px; font-size: 12px; color:#999;">
                注：请先添加课程的章，然后在添加课程的节（只有节才可以设置课件）。
            </div>
<!--             <el-button type="primary" @click="addClass()">添加课件</el-button> -->
        </el-row>

        <div class="block">
            <el-tree
            :data="courseChapterData"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                <el-button type="text" v-if=
                "data.type == 'chapter'" class="" @click="addClass(data)">添加课件</el-button>
                <el-button type="text" @click="editorChapterHandle(node, data)">编辑 </el-button>
                <el-button type="text" @click="deleteChapterHandle(node, data)">删除</el-button>
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
                <el-button type="primary" @click="chapterFormSubmit('courseChapterForm')">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加课件 -->
        <el-dialog title="添加课件" :visible.sync="dialogUpload" width="700px">
            <div class="add-content">
                <div class="head">
                <el-steps align-center :active="stepActive" finish-status="success">
                  <el-step title="选择课件类型"></el-step>
                  <el-step title="设置课件内容"></el-step>
                  <!-- <el-step title="步骤 3"></el-step> -->
                </el-steps>
<!--                     <div class="head-child">
                        <p>1</p>
                        <div>选择课件类型</div>
                    </div>
                    <div class="head-child">
                        <p>2</p>
                        <div>设置课件内容</div>
                    </div> -->
                </div>
                <div class="middle" v-if="!next">
                    <img src="../../../assets/movie.png" alt="">
                    <p>视频</p>
                </div>
                <div class="middle-form" v-if="next">
                    <el-form :model="nodeForm" :rules="nodeFormRules" ref="nodeForm" label-width="100px"> 
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="nodeForm.title" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="视频" prop="title">
                            <el-input v-model="nodeForm.video" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="视频时间" prop="title">
                            
                              <el-col :span="5" style="margin-right: 20px;"><el-input v-model="nodeForm.minute" auto-complete="off"><template slot="append">分</template></el-input></el-col>
                              <el-col :span="5"><el-input v-model="nodeForm.second" auto-complete="off"><template slot="append">秒</template></el-input></el-col>
                            
                            
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="!next" @click="next = true">下一步</el-button>
                <el-button type="primary" v-if="next" @click="next = false">上一步</el-button>
                <el-button type="primary" v-if="next">保存</el-button>            </div>
        </el-dialog>
    </div>
</template>

<script>
var newId = 1000;
import {
    createCourseSection,
    putCourseSection,
    deleteCourseSection} from '@/api/section'
import {
    createCourseChapter, 
    putCourseChapter,
    deleteCourseChapter,
    getCourseChapterList} from '@/api/chapter'
export default {
  data() {
    return {
		input:'',
        stepActive: 0,
        dialog:false,
        dialogUpload: false,
        sectionName: '',
        isEditorStatus: false,
        next:false,
        formLabelWidth: '80px',
        courseChapterForm: {
            title: '',
            courseChapterId: ''
        },
        nodeForm: {
            title: 'title',
            thumb: '',
            video: '',
            minute: 22,
            second: 11
        },
        currentCourseChapterRow: {},
        courseChapterData: [],
        courseChapterRules:{},
        courseChapterRules: {
            title: [{
                required: true, message: '请输入课程章名', trigger: 'blur'
            }]
        },
        nodeFormRules: {}
    }
  },
  props: {
    cid: [String]
  },
  mounted() {  
    console.log('子组件', this.cid);
    // let all = document.querySelectorAll('.el-tree-node__content');
    //     all[all.length - 1].style.borderBottom = '1px solid #ddd' 
    if(this.cid){
        this.getCourseChapterListHandle(this.cid)
    }
  },

  computed: {
  },
  components: {
  },
  methods: {
    getCourseChapterListHandle(cid){
        var _self = this
        getCourseChapterList({
            courseSubjectId: cid
        }).then(function(res){
            console.log('获取章节列表', res)
            if(res.code === 0) {
              if(res.data && res.data.length) {
                // console.log(res.data)
                _self.courseChapterData = _self.formartCourseChapterList(res.data)
                console.log(_self.courseChapterData)
              }
            }
        })
    },
    formartCourseChapterList(data){
        var _self = this
        for(var i=0; i<data.length; i++) {
            data[i].label = data[i].courseChapterTitle
            data[i].type = 'chapter'
        }

        return data
    },
    createCourseChapterHandle(cid, title){
        createCourseChapter({
            courseSubjectId: cid,
            courseChapterTitle: title
        }).then(function(res){
            if(res.data === 0) {
              
            }
        })
    },
	chapterFormSubmit(formName) {
        var _self = this, title = _self.courseChapterForm.title;
        console.log(title)
        _self.onRuleForm(formName, function(){
            if(_self.isEditorStatus) {
                //_self.$set('currentCourseChapterRow', '')
                _self.currentCourseChapterRow.label = title
                //_self.putCourseChapterHandle(_self.cid, _self.courseChapterForm.courseChapterId, title)
            }else {
                var data = _self.formartCourseChapter(title)
                _self.courseChapterData.push(data) 
                //_self.createCourseChapterHandle(_self.cid, title)
            }
            _self.dialog = false
            _self.isEditorStatus = false
            console.log('提交时的数据', _self.courseChapterData)
        })
        
	},
    formartCourseChapter(value){
        var index = this.courseChapterData.length + 1
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
    addClass(data) {
        var _self = this, 
            courseChapterForm = _self.courseChapterForm;
        // _self.createCourseSectionHandle(_self.cid, courseChapterForm.courseChapterId)
        // const newChild = { id: newId++, label: 'testtest', children: [] };
        // if (!data.children) {
        //   this.$set(data, 'children', []);
        // }

        // data.children.push(newChild);
        _self.dialogUpload = true
    },
    deleteChapterHandle(node, data){
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        // deleteCourseChapter({
        //     id: data.id
        // }).then(function(res){
        //     if(res.code === 0) {

        //     }
        // })
    },
    createCourseSectionHandle(cid, courseChapterId, sid){
      createCourseSection({
        "courseSectionId": sid || '',
        "courseChapterId": courseChapterId,
        "courseSubjectId": cid,
        "courseSectionTitle": "课程介绍",
        "courseSectionVideoFileid": "string",
        "courseSectionVideoName": "string",
        "courseSectionVideoUrl": "string",
        "courseSectionVideoCoverName": "string",
        "courseSectionVideoCoverUrl": "string",
        "courseSectionVideoSeconds": 90
      }).then(function(res){
        if(res.code === 0){

        }
      })
    },

    editorChapterHandle(node, data){
        var _self = this
        _self.dialog = true
        _self.isEditorStatus = true
        console.log('编辑时的数据',data)
        _self.courseChapterForm.title = data.label
        _self.currentCourseChapterRow = data
        // _self.courseChapterForm.courseChapterId = data.courseChapterId
            // this.createCourseChapterHandle()
        // this.putCourseChapterHandle(_self.cid, data.courseChapterId, _self.courseChapterForm.title)
        //console.log(row, data)
    },
    putCourseChapterHandle(cid, chapterId, chapterTitle){
        var _self = this
        putCourseChapter({
            courseSubjectId: cid,
            courseChapterId: chapterId,
            courseChapterTitle: chapterTitle
        }).then(function(res){
            if(res.code === 0) {
                console.log('修改章节标题成功')

            }
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
        console.log('关闭的回调')
        this.$refs[formName].resetFields();
      }

  }
}
</script>

<style lang="scss">
    .class-upload-page{
        text-align: left;
        .el-steps {
            width: 100%;
        }
        .block{
            padding-top: 20px;
            font-size: 18px;
            .el-tree-node__content{
                padding-top: 10px;
                padding-bottom: 10px;
                border: 1px solid #ddd;
                // border-bottom: 0;
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
