import request from '@/utils/request';

export async function getQuestionDetail(params) {
  const { id } = params
  return request(`/v1/topic/${id}`, {
    method: 'GET',
  });
}
