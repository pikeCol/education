import request from '@/utils/request';

export async function getQuestionQuerys(params) {
  return request('/question/querys', {
    method: 'GET',
    params
  });
}
export async function getQuestionShareList(params) {
  return request('/v1/paper/share/list', {
    method: 'GET',
    params
  });
}
export async function cancelShare(params) {
  return request('/v1/paper/share/cancel', {
    method: 'POST',
    data: params,
  });
}
export async function deleteSharePaper(params) {
  const {id} = params
  return request(`/v1/paper/${id}`, {
    method: 'DELETE',
    data: params,
  });
}

