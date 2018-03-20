/* eslint-disable import/no-namespace */
import Vue from "vue";
import Vuex from "vuex";
import * as example from "./exampleStore";

Vue.use(Vuex);

const modules = { example };

export default new Vuex.Store({
  strict: true,
  modules: modules.map(module => ({
    ...module,
    strict: true,
    namespaced: true
  }))
});
