import { registerComponents, vueUse } from '../../utils';

import dPopover from './Popover.vue';

const components = {
    dPopover
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
