import { registerComponents, vueUse } from './../../utils';

import dContainer from './Container.vue';
import dRow from './Row.vue';
import dCol from './Col.vue';

const components = {
    dContainer,
    dRow,
    dCol,
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
