import request from '@/utils/request';

export async function getQuestionQuerys(params) {
  return request('/question/querys', {
    method: 'GET',
    params
  });
}
export async function getQuestionShareList(params) {
  let p = {}
  if (params.subject) {
    p = {
      ...params,
      leafNodeIds: params.subject.pop()
    }
    delete p.subject
  } else {
    p = params
  }
  return request('/v1/paper/share/list', {
    method: 'GET',
    params: p
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

