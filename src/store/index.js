import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
})

export default createStore({
  state: {
    isCollapse: false,
    auth: {
      id: null
    },
  },
  mutations: {
    isCollapseState() {
      this.isCollapse = !this.isCollapse
    },
    logIn(state, payload){
      state.auth = payload
    },
    logOut(state){
      state.auth.id = null
    }
  },
  actions: {

  },
  plugins: [vuexLocal.plugin],

  modules: {

  }
})