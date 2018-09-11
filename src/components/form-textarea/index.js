import { registerComponents, vueUse } from './../../utils'

import dFormTextarea from './FormTextarea.vue'

const components = {
    dFormTextarea,
    dTextarea: dFormTextarea
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
