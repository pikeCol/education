import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/v1/login', {
    method: 'POST',
    data: params,
  });
}
export async function getCaptcha(params) {
  return request('/v1/captcha/generate', {
    method: 'GET',
    params
  });
}
export async function getMobileCaptcha(params) {
  return request(`/v1/sms/server/verifyCode/get`, {
    method: 'POST',
    data: params
  });
}
