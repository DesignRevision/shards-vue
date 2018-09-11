import { registerComponents, vueUse } from './../../utils';

import dLink from './Link.vue';

const components = {
    dLink
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
