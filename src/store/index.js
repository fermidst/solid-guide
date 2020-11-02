import Vue from "vue";
import Vuex from "vuex";
import employees from "./modules/employees";
import positions from "./modules/positions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { employees, positions }
});
