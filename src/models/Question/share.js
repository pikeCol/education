import { getQuestionQuerys } from "@/services/questions/share"


const Model = {
  namespace: 'QuestionShare',
  state: {
    loading: false,
    querys: null
  },
  effects: {
    *loadQuery({ payload }, { call, put }) {
      const response = yield call(getQuestionQuerys, payload)
      if (response.code < 300) {
        yield put({
          type: 'changeQuerys',
          payload: response.data
        })
      }

    }
  },
  reducer: {
    changeQuerys(states, { payload }) {
      return {
        ...states,
        querys: payload
      }
    }
  }
}
export default Model