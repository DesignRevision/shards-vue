import { registerComponents, vueUse } from './../../utils'

import dLink from '../link/Link.vue'
import dBreadcrumb from './Breadcrumb.vue'
import dBreadcrumbItem from './BreadcrumbItem.vue'
import dBreadcrumbLink from './BreadcrumbLink.vue'

const components = {
    dLink,
    dBreadcrumb,
    dBreadcrumbItem,
    dBreadcrumbLink
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
