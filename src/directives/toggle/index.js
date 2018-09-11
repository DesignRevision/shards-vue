import dToggle from './toggle'
import { registerDirectives, vueUse } from '../../utils'

const directives = {
  dToggle
}

const VuePlugin = {
  install (Vue) {
    registerDirectives(Vue, directives)
  }
}

vueUse(VuePlugin)

export default VuePlugin
