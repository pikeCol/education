import request from '@/utils/request';

export async function getQuestionSubject(params) {
  return request('/v1/subjectDictionary/directories', {
    method: 'GET',
    params,
  });
}

export async function getSubjectDictionaryList(params) {
  return request('/v1/subjectDictionary/list', {
    method: 'GET',
    params,
  });
}

export async function addQuestionSubject(params) {
  return request('/v1/subjectDictionary/directories', {
    method: 'POST',
    data: params,
  });
}

export async function updateQuestionSubject(params) {
  return request('/v1/subjectDictionary/directories', {
    method: 'PUT',
    data: params,
  });
}

export async function deleteQuestionSubject(params) {
  const { id } = params
  return request(`/v1/subjectDictionary/directories/${id}`, {
    method: 'DELETE'
  });
}

export async function getTags(params) {
  return request('/v1/tag/list', {
    method: 'GET',
    params
  });
}
export function uploadImg(params) {
  return request('/v1/file/images/upload', {
    method: 'POST',
    data: params,
  });
}
export async function createQuestion(params) {
  return request('/v1/topic', {
    method: 'POST',
    data: params,
  });
}
export async function updateQUestion(params) {
  return request('/v1/topic', {
    method: 'PUT',
    data: params,
  });
}
export async function getMyQuestionList(params) {
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
  return request('/v1/topic/list', {
    method: 'GET',
    params: p
  });
}
export async function deleteQuestion(params) {
  const { id } = params
  return request(`/v1/topic/${id}`, {
    method: 'DELETE'
  });
}

export async function addTopic(params) {
  return request(`/v1/paper/addTopic`, {
    method: 'post',
    data: params,
  });
}

export async function deleteTopic(params) {
  return request(`/v1/paper/deleteTopic`, {
    method: 'DELETE',
    data: params,
  });
}
