import { registerComponents, vueUse } from '../../utils';

import dButtonGroup from './ButtonGroup.vue';

const components = {
    dButtonGroup,
    sBtnGroup: dButtonGroup
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
