import { registerComponents, vueUse } from './../../utils'

import dFormInput from './FormInput.vue'

const components = {
    dFormInput,
    dInput: dFormInput
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
