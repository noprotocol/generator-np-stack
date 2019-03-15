/**
 * Every .js file inside the src/store directory is transformed as a namespaced module.
 * Similar to Nuxt's [Modules mode](https://nuxtjs.org/guide/vuex-store/)
 */

/* eslint-disable import/no-namespace */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const refresh = false; // When modules change: do a full-page-refresh instead of a hotUpdate.

function importModules() {
  const requireModule = require.context(".", false, /\.js$/);
  const modules = {};
  for (const filename of requireModule.keys()) {
    if (filename === "./index.js") {
      continue;
    }
    const name = filename.replace(/^\.\/|\.js$/g, "");
    modules[name] = {
      strict: true,
      namespaced: true,
      ...requireModule(filename)
    };
  }
  if (module.hot) {
    if (refresh) {
      module.hot.decline(requireModule.id);
    } else {
      module.hot.accept(requireModule.id, () => {
        store.hotUpdate({ modules: importModules() });
      });
    }
  }
  return modules;
}

const store = new Vuex.Store({
  strict: true,
  modules: importModules()
});
export default store;
