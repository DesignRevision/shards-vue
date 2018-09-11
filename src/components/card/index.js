import { registerComponents, vueUse } from '../../utils';

import dCard from './Card.vue'
import dCardBody from './CardBody.vue'
import dCardFooter from './CardFooter.vue'
import dCardGroup from './CardGroup.vue'
import dCardHeader from './CardHeader.vue'
import dCardImg from './CardImg.vue'

const components = {
    dCard,
    dCardBody,
    dCardFooter,
    dCardGroup,
    dCardHeader,
    dCardImg
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
