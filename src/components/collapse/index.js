import { registerComponents, vueUse } from './../../utils';

import dCollapse from './Collapse.vue';

const components = {
    dCollapse
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
