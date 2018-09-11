import { registerComponents, vueUse } from '../../utils'

import dImg from './Image.vue'

const components = {
    dImg,
    dImage: dImg
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
