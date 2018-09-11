import { registerComponents, vueUse } from './../../utils';

import dNav from './Nav.vue';
import dNavItem from './NavItem.vue';

const components = {
    dNav,
    dNavItem
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
