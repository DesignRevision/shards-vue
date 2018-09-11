import { registerComponents, vueUse } from './../../utils';

import dProgress from './Progress.vue';
import dProgressBar from './ProgressBar.vue'

const components = {
    dProgress,
    dProgressBar
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
