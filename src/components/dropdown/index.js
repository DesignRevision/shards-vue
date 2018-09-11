import { registerComponents, vueUse } from '../../utils';

import dDropdown from './Dropdown.vue'
import dDropdownItem from './DropdownItem.vue'
import dDropdownHeader from './DropdownHeader.vue'
import dDropdownDivider from './DropdownDivider.vue'

const components = {
    dDropdown,
    dDropdownItem,
    dDropdownHeader,
    dDropdownDivider
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
