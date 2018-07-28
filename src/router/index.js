import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'


/* 课程管理 */
import CourseDetail from '../views/course/CourseDetail'
import CourseList from '../views/course/CourseList'

/* 分类管理 */


/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    hidden: true,
    children: [{
      path: 'home',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: 'Course',
    meta: { title: '课程管理', icon: 'kechengguanli' },
    children: [
      {
        path: 'create',
        name: 'CourseCreate',
        component: () => import('@/views/course/CourseDetail'),
        meta: { title: '新建课程', icon: '' }
      },
      {
        path: 'editor/:cid',
        name: 'CourseEditor',
        hidden: true,
        component: () => import('@/views/course/CourseDetail'),
        meta: { title: '课程编辑', icon: '' }
      },
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/views/course/CourseList'),
        meta: { title: '课程列表', icon: '' }
      },
      {
        path: 'completed',
        name: 'CourseCreationCompleted',
        hidden: true,
        component: () => import('@/views/course/CourseCreationCompleted'),
        meta: { title: '创建(编辑)完成', icon: '' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/CategoryList'),
        meta: { title: '课程分类', icon: '' }
      },
      {
        path: 'category/second/:cid',
        name: 'CategorySecond',
        hidden: true,
        component: () => import('@/views/category/CategoryList'),
        meta: { title: '课程分类', icon: '' }
      },
      {
        path: 'category/third/:cid',
        name: 'CategoryThird',
        hidden: true,
        component: () => import('@/views/category/CategoryList'),
        meta: { title: '课程分类', icon: '' }
      },
      {
        path: 'courseware/:cid',
        name: 'Courseware',
        hidden: true,
        component: () => import('@/views/course/components/CourseChapter'),
        meta: { title: '创建课件', icon: '' }
      }
    ]
  },
  {
    path: '/gallery',
    component: Layout,
    redirect: '/gallery/list',
    name: 'Gallery',
    meta: { title: '图集管理', icon: 'user-setting' },
    children:[{
      path: 'list',
      name: 'GalleryList',
      component: () => import('@/views/gallery/GalleryList'),
      meta: { title: '图集列表', icon: '' }

    },{
      path: 'list',
      name: 'GalleryListAAA',
      component: () => import('@/views/gallery/GalleryList'),
      meta: { title: '图集审核', icon: '' }

    },{
      path: '/gallery/media/:sid',
      name: 'GalleryMedia',
      hidden: true,
      component: () => import('@/views/gallery/MediaList'),
      meta: { title: '媒体列表', icon: '' }

    }]     
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    meta: { title: '用户管理', icon: 'user-setting' },
    children:[{
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/user/List'),
      meta: { title: '用户列表', icon: '' }

    },{
      path: 'teacher/list',
      name: 'TeacherList',
      component: () => import('@/views/user/TeacherList'),
      meta: { title: '讲师列表', icon: '' }

    }]     
  },
  {
    path: '/system',
    name: 'System',
    component: Layout,
    meta: { title: '系统设置', icon: 'xtsz' },
    children:[{
      path: 'base',
      name: 'Base',
      component: () => import('@/views/system/Base'),
      meta: { title: '基础设置', icon: '' },
    },{
      path: 'ip-blacklist',
      name: 'ipBlacklist',
      component: () => import('@/views/system/Base'),
      meta: { title: 'IP黑名单', icon: '' },
    },{
      path: 'logs',
      name: 'Logs',
      component: () => import('@/views/system/Base'),
      meta: { title: '登录日志', icon: '' },
    }]       
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history',
  routes: constantRouterMap
})

