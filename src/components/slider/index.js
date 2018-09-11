import { registerComponents, vueUse } from './../../utils'

import dSlider from './Slider.vue'

const components = {
    dSlider
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
