import request from '@/utils/request';

export async function getSchool(params) {
  return request('/v1/orgManager/schools', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
export async function getAccounts(params) {
  return request('/v1/orgManager/schools/accounts', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export async function addAccount(params) {
  return request('/v1/orgManager/schools/account', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function putAccount(params) {
  return request('/v1/orgManager/schools/account', {
    method: 'PUT',
    data: params,
  });
}

export async function getGradeList(params) {
  return request('/v1/subjectDictionary/grade/list', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
export async function getAccountDetail(params) {
  return request('/v1/orgManager/account/detail', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export async function getRoleList(params) {
  return request('/v1/role/list', {
    method: 'GET',
    params: {
      ...params
    },
  });
}




export async function postNewSchool(params) {
  return request('/v1/orgManager/schools', {
    method: 'POST',
    data: {
      ...params
    },
  });
}
export async function getSchoolDetail(params) {
  return request(`/v1/orgManager/schools/${params.id}`, {
    method: 'GET',
    params: {
      ...params
    },
  });
}
