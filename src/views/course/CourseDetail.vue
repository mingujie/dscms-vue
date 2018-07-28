<template>
    <div class="class-detail-page app-container">
        <el-tabs type="border-card" class="ds-tabs">
            <el-tab-pane label="课程信息">
                <class-info></class-info>
            </el-tab-pane>
<!--             <el-tab-pane label="课件信息">
                <class-upload :cid="cid"></class-upload>
            </el-tab-pane> -->
        </el-tabs>
    </div>
</template>

<script>
import ClassInfo from './components/Info'
import ClassUpload from './components/Upload' 
export default {
  components: {
      ClassInfo,
      ClassUpload
  },
  data() {
    return {
		  input:'',
      cid: ''
        
    }
  },
  mounted() {  

  },
  computed: {
  },
  created(){
    var _self = this
    _self.routeChangeHandle(_self.$route)

  },
  watch: {
    '$route'(to, from){
      console.log('路由', to)
      this.routeChangeHandle(to)
    }  
  },
  methods: {
		submit() {
			
		},
    routeChangeHandle(router){
      var _self = this
      if(router.params.cid) {
        _self.cid = router.params.cid
      }
      console.log('cid', router.params.cid)
    }
  }
}
</script>

<style lang="scss">
    .class-detail-page{

    }



</style>
