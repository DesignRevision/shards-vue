import { registerComponents, vueUse } from './../../utils'

import dFormRadio from './FormRadio.vue'

const components = {
    dFormRadio,
    dRadio: dFormRadio
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
