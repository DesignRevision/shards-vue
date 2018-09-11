import * as components from './components'
import * as directives from './directives'
import { vueUse } from './utils'

const VuePlugin = {
  install: function (Vue) {
    if (Vue._shards_vue_installed) {
      return
    }

    Vue._shards_vue_installed = true;

    // Register component plugins
    for (let component in components) {
      Vue.use(components[component])
    }

    // Register directive plugins
    for (let directive in directives) {
      Vue.use(directives[directive])
    }
  }
}

vueUse(VuePlugin)

export default VuePlugin