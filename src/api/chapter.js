import request from '@/utils/request'

export function createCourseChapter(courseSubjectId, courseChapterTitle) {
  return request({
    url: '/course/chapter',
    method: 'post',
    data: {
      courseSubjectId,
      courseChapterTitle}
  }).then(res => res.data)
}

export function getCourseChapterList(params) {
  return request({
    url: '/course/chapter/list',
    method: 'get',
    params: params 
  }).then(res => res.data)
}

export function deleteCourseChapter(id) {
  return request({
    url: '/course/chapter',
    method: 'delete',
    data: { id }
  }).then(res => res.data)
}

export function putCourseChapter( params ) {
  return request({
    url: '/course/chapter',
    method: 'put',
    data: params
  }).then(res => res.data)
}

