<template>
    <input ref="input"
        :id="computedID"
        :type="type"
        :name="name"
        :disabled="disabled"
        :required="required"
        :readonly="readonly || plaintext"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-required="required ? true : null"
        :aria-invalid="computedAriaInvalid"
        :value="value"
        :class="[
            plaintext ? 'form-control-plaintext' : 'form-control',
            plaintext ? 'w-100' : '',
            size ? `form-control-${size}` : null,
            computedStateClass
        ]"
        v-bind="$attrs"
        @input="onInput"
        @change="onChange" />
</template>

<script>
import { guid } from './../../utils'
import { INPUT_TYPES } from './../../utils/constants'

export default {
    name: 'd-form-input',
    props: {
        /**
         * Input type.
         */
        type: {
            type: String,
            default: 'text',
            validator: (v) => INPUT_TYPES.includes(v)
        },
        /**
         * Input value.
         */
        value: {
            type: [String, Number],
            default: ''
        },
        /**
         * Input size.
         */
        size: {
            type: String,
            default: null
        },
        /**
         * Input state. eg: 'valid', 'invalid'
         */
        state: {
            type: [Boolean, String],
            default: null,
            validator: (v) => [null, 'valid', 'invalid', true, false].includes(v)
        },
        /**
         * Input name.
         */
        name: {
            type: String
        },
        /**
         * Input disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Input required state.
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * Input placeholder text.
         */
        placeholder: {
            type: String,
            default: null
        },
        /**
         * Enable or disable field autocomplete.
         */
        autocomplete: {
            type: String,
            default: null
        },
        /**
         * Display as plain text and remove styling.
         */
        plaintext: {
            type: Boolean,
            default: false
        },
        /**
         * Display as read-only.
         */
        readonly: {
            type: Boolean,
            default: false
        },
        /**
         * The input `aria-invalid` attribute.
         */
        ariaInvalid: {
            type: [Boolean, String],
            default: false
        }
    },
    watch: {
        value (newVal) {
            this.setValue(newVal)
        }
    },
    mounted() {
        if (this.value) {
            this.setValue(this.value)
        }
    },
    computed: {
        computedID() {
            return `dr-input-${guid()}`
        },
        computedAriaInvalid() {
            if (!this.ariaInvalid || this.ariaInvalid === 'false') {
                return this.state === 'invalid' ? 'true' : null
            }

            if (this.ariaInvalid === true) {
                return 'true'
            }

            return this.ariaInvalid
        },
        computedState() {
            if (this.state === true || this.state === 'valid') {
                return true
            } else if (this.state === false || this.state === 'invalid') {
                return false
            }

            return null
        },
        computedStateClass() {
            if (this.computedState === true || this.computedState === 'valid') {
                return 'is-valid'
            } else if (this.computedState === false) {
                return 'is-invalid'
            }

            return null
        }
    },
    methods: {
        setValue(value) {
            this.$refs.input.value = value
            this.$emit('input', value)
        },
        onInput(e) {
            this.setValue(e.target.value)
        },
        onChange(e) {
            this.setValue(e.target.value)
            this.$emit('change', e.target.value)
        }
    }
}
</script>
