<template>
  <div class="app-container">
    <div class="ds-alert" style="padding-top:50px">
      <el-alert
        :closable="false"
        :title="alertTitle"
        type="success"
        description="你可以返回继续编写课程表单、或返回课程列表。"
        show-icon>
      </el-alert>
      <div style="padding-top:20px;">
        <el-button type="info" plain @click="toCourseEditor">继续编写课程</el-button>
        <el-button type="success" plain @click="toCourseList">返回课程列表</el-button></div>
    </div>
  </div>
</template>

<script>
export default {
  // components: {
  //     ClassInfo,
  //     ClassUpload
  // },
  data() {
    return {

      alertTitle: '课程创建成功',
      courseLink: ''
    }
  },
  mounted() {  

  },
  computed: {
  },
  watch: {
    '$route'(to, from){

    }
  },
  created(){
    var _self = this, $route = _self.$route
    console.log(_self.$route)


  },  
  methods: {
		submit() {
			
		},
    toCourseEditor(){
      var _self = this, $route = _self.$route
      if($route.query.cid) {
        this.$router.push({name: 'CourseEditor', params: { cid : $route.query.cid} })
      }else {
        this.$router.push({name: 'CourseCreate'})
      }
    },
    toCourseList(){
      this.$router.push({name: 'CourseList' })
    }
  }
}
</script>

<style lang="scss">
    .class-detail-page{

    }
    .ds-alert {
      width: 40%;
      margin: 0 auto;
    }


</style>
