<template>
    <label :class="[
        'custom-control',
        'custom-radio',
        inline ? 'custom-control-inline' : '',
        computedStateClass
    ]">
        <input type="radio"
            ref="check"
            autocomplete="off"
            :aria-required="required ? 'true' : null"
            :id="computedID"
            :class="[ 'custom-control-input', computedStateClass ]"
            :name="name"
            :value="value"
            :disabled="disabled"
            :required="name && required"
            v-model="computedLocalChecked"
            @change="handleChange" />
        <label :for="computedID" class="custom-control-label" aria-hidden="true"></label>
        <span :class="['custom-control-description']">
            <slot />
        </span>
    </label>
</template>

<script>
import { guid } from '../../utils'

export default {
    name: 'd-form-radio',
    model: {
        prop: 'checked',
        event: 'input'
    },
    data() {
        return {
            localChecked: this.checked
        }
    },
    props: {
        /**
         * The radio input name.
         */
        name: {
            type: String
        },
        /**
         * The radio input ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The radio input value.
         */
        value: {
            default: true
        },
        /**
         * The disabled state.
         */
        disabled: {
            type: Boolean
        },
        /**
         * The required state.
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * The checked state.
         */
        checked: {
            type: [Boolean, String, Array]
        },
        /**
         * The validation state.
         */
        state: {
            type: [Boolean, String],
            default: null
        },
        /**
         * Whether the radio should be displayed inline, or not.
         */
        inline: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedLocalChecked: {
            get() {
                return this.localChecked
            },

            set(val) {
                this.localChecked = val
            }
        },
        computedID() {
            return this.id || `dr-radio-${guid()}`
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
        computedStateClass() {
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
        computedLocalChecked(newVal, oldVal) {
            if (newVal == oldVal) {
                return
            }

            this.$emit('input', newVal)
        },

        checked(newVal, oldVal) {
            if (newVal == oldVal) {
                return
            }

            this.computedLocalChecked = newVal
        },
    },

    methods: {
        handleChange(e) {
            this.$emit('change', e.target.checked ? this.value : null)
        }
    }
}
</script>
