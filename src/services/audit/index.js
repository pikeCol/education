import request from '@/utils/request';

export function changeQuestionStatus(params) {
  return request('/v1/audit/publishAudit/audit', {
    method: 'POST',
    data: params,
  });
}

/**
 * 错提审核
 * @param params
 * @returns {Promise<any>}
 */
export function correctAudit(params) {
  return request('/v1/audit/correctAudit/audit', {
    method: 'POST',
    data: params,
  });
}
export async function getWrongQuestionList(params) {
  let p = {}
  if (params.subject) {
    p = {
      ...params,
      subject: params.subject.join(',')
    }
  } else {
    p = params
  }
  return request('/v1/audit/correctAudit/list', {
    method: 'GET',
    params: p
  });
}

export async function getAuditList(params) {
  let p = {}
  if (params.subject) {
    p = {
      ...params,
      subject: params.subject.join(',')
    }
  } else {
    p = params
  }
  return request('/v1/audit/list', {
    method: 'GET',
    params: p
  });
}