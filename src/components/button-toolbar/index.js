import { registerComponents, vueUse } from '../../utils';

import dButtonToolbar from './ButtonToolbar.vue';

const components = {
    dButtonToolbar,
    dBtnToolbar: dButtonToolbar
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
