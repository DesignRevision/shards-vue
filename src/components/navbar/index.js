import { registerComponents, vueUse } from '../../utils';

import dNavbar from './Navbar.vue'
import dNavbarBrand from './NavbarBrand.vue'
import dNavbarNav from './NavbarNav.vue'
import dNavbarToggle from './NavbarToggle.vue'

const components = {
    dNavbar,
    dNavbarBrand,
    dNavbarNav,
    dNavbarToggle
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
