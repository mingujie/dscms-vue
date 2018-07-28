<template>
    <div class="ds-wang-editor">
      <div ref="editor" id="editorEle" style="text-align:left;position: relative;z-index: 1;" ></div>
    </div>
</template>

<script>
import Editor from 'wangeditor'
export default {
  components: {
  },
  data() {
    return {
      editor: null,
      editorContent: ''
    }
  },
  props: {
    value: [String],
    cid: [String]
  },
  watch:{
    value(val){
      this.setEditorContent(val)
    }
  },
  mounted() {  
    console.log(this.value)
    this.initEditor()
  },

  computed: {

  },

  methods: {
    initEditor(){
      var _self = this
      var editor  = new Editor(_self.$refs.editor);

      editor.customConfig.uploadImgServer = '/upload'  // 
      //上传图片到服务器
      editor.customConfig.onchange = (html) => {
          _self.editorContent = html
          _self.$emit('input', html)
      }
      editor.create()     
      
      _self.editor = editor
    },
    setEditorContent(val){
      var _self = this
      _self.editor.txt.html(val)
    }
  }
}
</script>

<style lang="scss">
  .ds-wang-editor {
    
  }
</style>
