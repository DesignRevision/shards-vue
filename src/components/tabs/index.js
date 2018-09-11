import { registerComponents, vueUse } from '../../utils';

import dTabs from './Tabs.vue';
import dTab from './Tab.vue';

const components = {
    dTabs,
    dTab
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
