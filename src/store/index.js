import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()], // vuex数据持久化
  state: {
    todoArray: [],
    finishedArray: [],
    keepTime: 0
  },
  getters: {
  },
  mutations: {
    SET_TODO_ARRAY(state, list) {
      state.todoArray = list;
    },
    SET_FINISHED_ARRAY(state, list) {
      state.finishedArray = list;
    },
    SET_KEEP_TIME(state, list) {
      state.keepTime = list;
    }
  },
  actions: {
  },
  modules: {
  }
})
