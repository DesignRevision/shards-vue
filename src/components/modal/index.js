import { registerComponents, vueUse } from './../../utils';

import dModal from './Modal.vue';
import dModalHeader from './ModalHeader.vue';
import dModalTitle from './ModalTitle.vue';
import dModalBody from './ModalBody.vue';
import dModalFooter from './ModalFooter.vue';

const components = {
    dModal,
    dModalHeader,
    dModalTitle,
    dModalBody,
    dModalFooter
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
