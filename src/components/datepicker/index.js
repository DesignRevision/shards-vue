import { registerComponents, vueUse } from './../../utils'

import dDatepicker from './Datepicker.vue'

const components = {
    dDatepicker
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
