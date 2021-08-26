import request from '@/utils/request';

export async function getQuestionDetail(params) {
  const { id } = params
  return request(`/v1/topic/${id}`, {
    method: 'GET',
  });
}

export async function getCorrectionQuestionDetail(params) {
  const { id } = params
  return request(`/v1/topic/correction/${id}`, {
    method: 'GET',
  });
}


export async function getShareDetail(params) {
  const { id } = params
  return request(`/v1/paper/${id}`, {
    method: 'GET',
  });
}

export async function paperPrint(params) {
  return request(`/v1/paper/print`, {
    method: 'GET',
    params
  });
}

export async function paperLog(params) {
  return request(`/v1/paper/log`, {
    method: 'POST',
    data: params
  });
}
