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
