import { registerComponents, vueUse } from './../../utils'

import dFormSelect from './FormSelect.vue'

const components = {
    dFormSelect,
    dSelect: dFormSelect
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
