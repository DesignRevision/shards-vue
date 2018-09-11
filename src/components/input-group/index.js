import { registerComponents, vueUse } from './../../utils'

import dInputGroup from './InputGroup.vue'
import dInputGroupText from './InputGroupText.vue'
import dInputGroupAddon from './InputGroupAddon.vue'

const components = {
    dInputGroup,
    dInputGroupText,
    dInputGroupAddon
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
