import request from '@/utils/request'

// request.create({
//    headers: { 'Content-Type': 'application/json;charset=utf-8' }
// });

const base = '';

let host = 'http://121.40.241.35:3000';

export const getUserLoginInfo = params => { 
console.log('请求了')
  return request.post('/login', params).then(res => res.data)
};


//课程创建
export const createCourseSubject = params => { 
  return request.post('/course/subject', params).then(res => res.data)
};
//课程修改
export const putCourseSubject = params => { 
  return request.put(`/course/subject`, params).then(res => res.data)
};
//课程删除
export const deleteCourseSubject = params => { 
  return request.delete(`/course/subject`, {data: params}).then(res => res.data)
};
//课程详情
export const getCourseSubjectDetail = params => { 
  return request.get(`/course/subject`, { params: params }).then(res => res.data);
};
//课程列表
export const getCourseSubjectPage = params => { 
  return request.get(`/course/subject/page`, { params: params }).then(res => res.data);
};


//课程分类

/**
 * getCourseSectionPage 获取课程列表
 * @param  {pageNum} params [description]
 * @return {[type]}        [description]
 */
export const getCourseCategoryPage = params => { 
  return request.get(`/course/category/page`, { params: params }).then(res => res.data);
};
/**
 * addCourseSection 新增课程分类
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export const addCourseCategory = params => { 
  return request.post(`/course/category`, params).then(res => res.data)
};

//修改课程分分类
export const putCourseCategory = params => { 
  return request.put(`/course/category`, params).then(res => res.data)
};

//删除课程分类
export const deleteCourseCategory = params => { 
  return request.delete(`/course/category`, {data: params}).then(res => res.data)
};


//图集API

//新建图集
export const createSwiper = params => { 
  return request.post(`/cms/swiper`, params).then(res => res.data)
};

//编辑图集
export const putSwiper = params => { 
  return request.put(`/cms/swiper`, params).then(res => res.data)
};

//删除图集
export const deleteSwiper = params => { 
  return request.delete(`/cms/swiper`, {data: params}).then(res => res.data)
};

//图集详情
export const getSwiper = params => { 
  return request.get(`/cms/swiper`, {params: params}).then(res => res.data)
};

//图集列表
export const getSwiperPage = params => { 
  return request.get(`/cms/swiper/page`, {params: params}).then(res => res.data)
};



//媒体
//新建图集
export const createSwiperMedia = params => { 
  return request.post(`/cms/swiper/media`, params).then(res => res.data)
};

//编辑图集
export const putSwiperMedia = params => { 
  return request.put(`/cms/swiper/media`, params).then(res => res.data)
};

//删除图集
export const deleteSwiperMedia = params => { 
  return request.delete(`/cms/swiper/media`, {data: params}).then(res => res.data)
};

//图集详情
export const getSwiperMedia = params => { 
  return request.get(`/cms/swiper/media`, {params: params}).then(res => res.data)
};

//图集列表
export const getSwiperMediaPage = params => { 
  return request.get(`/cms/swiper/media/page`, {params: params}).then(res => res.data)
};