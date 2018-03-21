/* eslint-disable import/no-namespace */
import Vue from "vue";
import Vuex from "vuex";
import * as example from "./exampleStore";

Vue.use(Vuex);

const modules = { example };

for (const config of Object.values(modules)) {
  config.strict = true;
  config.namespaced = true;
}

export default new Vuex.Store({
  strict: true,
  modules
});
