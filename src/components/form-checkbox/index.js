import { registerComponents, vueUse } from './../../utils'

import dFormCheckbox from './FormCheckbox.vue'

const components = {
    dFormCheckbox,
    dCheckbox: dFormCheckbox
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
