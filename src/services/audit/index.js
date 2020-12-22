import request from '@/utils/request';

export function changeQuestionStatus(params) {
  return request('/v1/audit/publishAudit/audit', {
    method: 'POST',
    data: params,
  });
}
export async function getWrongQuestionList(params) {
  return request('/v1/audit/correctAudit/list', {
    method: 'GET',
    params
  });
}