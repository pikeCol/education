import request from '@/utils/request';

export async function query() {
  return request('/users');
}
export async function queryCurrent() {
  const res = request('/v1/system/menus');
  console.log('====================================');
  console.log(res);
  console.log('====================================');
  return request('/v1/app/setting/userInfo');
}
export async function queryNotices() {
  return request('/notices');
}
