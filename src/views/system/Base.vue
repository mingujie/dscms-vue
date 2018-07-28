<template>
  <div class="ds-moudle">
    
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="ds-system-ruleForm">
          <el-form-item label="站点名称" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入站点名称"></el-input>
          </el-form-item>
          <el-form-item label="站点描述" prop="desc">
            <el-input type="textarea" placeholder="请输入站点描述" :rows="3" v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="站点关键词" prop="keywords">
            <el-input v-model="ruleForm.keywords" placeholder="请输入站点关键词"></el-input>
          </el-form-item>

          <el-form-item label="站点Logo">
            <el-upload
              class="ds-avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.logoUrl" :src="ruleForm.logoUrl" class="ds-avatar">
              <i v-else class="el-icon-plus ds-avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="站点版权信息" prop="copyright">
            <el-input type="textarea" :rows="3" placeholder="请输入站点版权信息" v-model="ruleForm.copyright"></el-input>
          </el-form-item>
          <el-form-item label="第三方统计代码" prop="countCode">
            <el-input type="textarea" placeholder="这里可以使用第三方版统计代码" :rows="3" v-model="ruleForm.countCode"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="ds-operational">
              <el-button @click="submitForm('ruleForm')">保存设置</el-button>
            </div>
           <!--  <el-button @click="resetForm('ruleForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
  
</template>

<script>



export default {
  data() {
    return {
      ruleForm: {
        logoUrl: '',
        title: '',
        desc: '',
        keywords: '',
        copyright: '',
        countCode: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入站点名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {  

  },
  computed: {
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
  }
}

</script>
<style>
  .ds-operational {
    text-align: left;
  }
  .ds-system-ruleForm {
    background: #fff;
    padding: 20px;
  }

</style>