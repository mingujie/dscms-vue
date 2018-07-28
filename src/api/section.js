import request from '@/utils/request'

export function createCourseSection( params ) {
  return request({
    url: '/course/section',
    method: 'post',
    data: params
  }).then(res => res.data)
}

export function getCourseSectionList(params) {
  return request({
    url: '/course/section/list',
    method: 'get',
    params: params 
  }).then(res => res.data)
}

export function deleteCourseSection( params ) {
  return request({
    url: '/course/section',
    method: 'delete',
    data: params
  }).then(res => res.data)
}

export function putCourseSection( params ) {
  return request({
    url: '/course/section',
    method: 'put',
    data: params}).then(res => res.data)
}

