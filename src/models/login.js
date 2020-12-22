import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin, getCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    // *getCaptcha({ payload }, { call, put }) {
    //   const response = yield call(getCaptcha, payload);
    //   const { code, data } = response
    //   if (code < 300) {
    //     yield put({
    //       type: 'changeCaptcha',
    //       payload: data
    //     })
    //   }

    // },
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      // response = {
      //   code: 200,
      //   data: {
      //     token: '123'
      //   }
      // }
      if (response.code < 300) {
        localStorage.setItem('token', response.data.token)
        yield put({
          type: 'changeLoginStatus',
          payload: response.data,
        }); // Login successfully

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      localStorage.setItem('token', null)
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('admin');
      return {
        ...state,
        token: payload.token
      };
    },
  },
};
export default Model;
