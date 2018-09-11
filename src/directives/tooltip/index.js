import dTooltip from './tooltip'
import { registerDirectives, vueUse } from '../../utils'

const directives = {
  dTooltip
}

const VuePlugin = {
  install (Vue) {
    registerDirectives(Vue, directives)
  }
}

vueUse(VuePlugin)

export default VuePlugin
