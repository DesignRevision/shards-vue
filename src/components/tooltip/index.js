import { registerComponents, vueUse } from './../../utils';

import dTooltip from './Tooltip.vue';

const components = {
    dTooltip
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
