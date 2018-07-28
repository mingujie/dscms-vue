<template>
  <div class="ds-sidebar">
    <div class="ds-logo"><strong>蛋耍网</strong></div>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      :unique-opened="true"
      active-text-color="#409EFF"
    >

      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ds-sidebar .ds-logo{
      line-height: 50px;
    height: 50px;
    font-size: 24px;
    background-color: #20222A !important;
    -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
    text-align: center;
    color: #FFF;

  }
  .ds-sidebar .el-scrollbar {
    height: 100%;
  }
</style>
