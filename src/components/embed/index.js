import { registerComponents, vueUse } from '../../utils';

import dEmbed from './Embed.vue';

const components = {
    dEmbed,
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
