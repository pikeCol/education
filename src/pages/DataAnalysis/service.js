import request from '@/utils/request';

export async function getDataAnalysisCount(params) {
  return request('/v1/dataAnalysis/operates/count', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
export async function getDataAnalysisBar(params) {
  return request('/v1/dataAnalysis/operates/histogram', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
export async function getDataAnalysisUserCount(params) {
  return request('/v1/dataAnalysis/userData/count', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
export async function getDataAnalysisSchoolCount(params) {
  return request('/v1/dataAnalysis/school/count', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
export async function getDataAnalysisPersonCount(params) {
  return request('/v1/dataAnalysis/person/count', {
    method: 'GET',
    params: {
      ...params
    },
  });
}


export async function getDataAnalysisOverall(params) {
  return request('/v1/dataAnalysis/overall', {
    method: 'GET',
  });
}


export async function getDataAnalysisSchoolOverall(params) {
  return request('/v1/dataAnalysis/schoolOverall', {
    method: 'GET',
    params: {
      ...params
    },
  });
}


export async function getDataAnalysisLoginDetail(params) {
  return request('/v1/dataAnalysis/login/detail', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export async function getDataAnalysisDownDetail(params) {
  return request('/v1/dataAnalysis/download/detail', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

