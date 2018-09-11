import { registerComponents, vueUse } from '../../utils'

import dForm from './Form.vue'
import dFormRow from './FormRow.vue'
import dFormText from './FormText.vue'
import dFormFeedback from './FormFeedback.vue'
import dFormValidFeedback from './FormValidFeedback.vue'
import dFormInvalidFeedback from './FormInvalidFeedback.vue'

const components = {
    dForm,
    dFormRow,
    dFormText,
    dFormFeedback,
    dFormValidFeedback,
    dValidFeedback: dFormValidFeedback,
    dFormInvalidFeedback,
    dInvalidFeedback: dFormInvalidFeedback
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
