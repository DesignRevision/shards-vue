<template>
    <textarea ref="input"
        :class="[
            plaintext ? 'form-control-plaintext' : 'form-control',
            plaintext ? 'w-100' : '',
            size ? `form-control-${this.size}` : null,
            stateClass
        ]"
        :style="{ width: plaintext ? '100%' : null, resize: noResize ? 'none' : null }"
        :name="name"
        :id="computedID"
        :disabled="disabled"
        :required="required"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :readonly="readonly || plaintext"
        :rows="rows"
        :wrap="wrap"
        :aria-required="required ? 'true' : null"
        :aria-invalid="computedAriaInvalid"
        @input="handleInput"></textarea>
</template>

<script>
import { guid } from '../../utils'

export default {
    name: 'd-form-textarea',
    data() {
        return {
            localValue: this.value
        }
    },
    props: {
        /**
         * The element name.
         */
        name: {
            type: String,
            default: null
        },
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The disabled state.
         */
        disabled: {
            type: Boolean,
            required: false
        },
        /**
         * The required state.
         */
        required: {
            type: Boolean,
            required: false
        },
        /**
         * The validity state.
         */
        state: {
            type: [Boolean, String],
            default: null,
            validator: v => ['valid', 'invalid', true, false, null].includes(v)
        },
        /**
         * The element's size.
         */
        size: {
            type: String,
            default: null,
            validator: v => ['sm', 'lg', null].includes(v)
        },
        /**
         * The placeholder value.
         */
        placeholder: {
            type: String,
            default: null
        },
        /**
         * The autocomplete status.
         */
        autocomplete: {
            type: String,
            default: null
        },
        /**
         * Whether the textarea should be read-only, or not.
         */
        readonly: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the textarea should be plain-text, or not.
         */
        plaintext: {
            type: Boolean,
            default: false
        },
        /**
         * The number of text rows.
         */
        rows: {
            type: [Number, String],
            default: null
        },
        /**
         * The textarea wrap style.
         */
        wrap: {
            type: String,
            default: 'soft',
            validator: v => ['soft', 'hard', 'off'].includes(v)
        },
        /**
         * Whether resizing should be disabled, or not.
         */
        noResize: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedID() {
            return this.id || `dr-textarea-${guid()}`
        },
        computedAriaInvalid() {
            // eslint-disable-next-line
            if (!Boolean(this.ariaInvalid) || this.ariaInvalid === 'false') {
                return this.computedState === false ? 'true' : null ;
            }

            if (this.ariaInvalid === true) {
                return 'true';
            }

            return this.ariaInvalid;
        },
        computedState() {
            if (this.state === true || this.state === 'valid') {
                return true
            }

            if (this.state === false || this.state === 'invalid') {
                return false
            }

            return null
        },
        stateClass () {
            if (this.computedState === true) {
                return 'is-valid'
            }

            if (this.computedState === false) {
                return 'is-invalid'
            }

            return null
        }
    },
    watch: {
        value(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.localValue = newVal;
            }
        },
        localValue(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.$emit('input', newVal);
            }
        }
    },
    methods: {
        handleInput(e) {
            this.localValue = e.target.value
        }
    }
}
</script>
