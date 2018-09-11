import { registerComponents, vueUse } from './../../utils'

import dBadge from './Badge.vue'

const components = {
    dBadge
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
