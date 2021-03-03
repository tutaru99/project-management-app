import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
})

export default createStore({
  state: {
    isCollapse: false,
  },
  mutations: {
    isCollapseState() {
      this.isCollapse = !this.isCollapse
    },
  },
  actions: {

  },
  plugins: [vuexLocal.plugin],

  modules: {

  }
})