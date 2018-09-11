import { registerComponents, vueUse } from './../../utils';

import dButton from './Button.vue';
import dButtonClose from './ButtonClose.vue';

const components = {
    dButton,
    dBtn: dButton,
    dButtonClose,
    dBtnClose: dButtonClose
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
