import { registerComponents, vueUse } from './../../utils';

import dListGroup from './ListGroup.vue';
import dListGroupItem from './ListGroupItem.vue'

const components = {
    dListGroup,
    dListGroupItem
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
