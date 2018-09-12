<template>
    <select ref="input"
        :class="[
            'form-control',
            stateClass,
            size ? `form-control-${size}` : null,
            !multiple && selectSize > 1 ? null : 'custom-select'
        ]"
        v-model="localValue"
        :id="computedID"
        :name="name"
        :multiple="multiple || null"
        :size="(multiple || selectSize > 1) ? selectSize : null"
        :disabled="disabled"
        :required="required"
        :aria-required="required ? true : null"
        :aria-invalid="computedAriaInvalid"
        @change="handleChange" >
        <option v-for="(option, idx) in formOptions"
            :key="`dr-opt-${idx}`"
            :value="option.value"
            :disabled="Boolean(option.disabled)">
                {{ option.text }}
        </option>
        <slot />
    </select>
</template>

<script>
import { guid } from '../../utils'

export default {
    name: 'd-form-select',
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The element name.
         */
        name: {
            type: String
        },
        /**
         * The select options.
         */
        options: {
            type: [Array, Object],
            default() {
                return []
            }
        },
        /**
         * The select value.
         */
        value: {},
        /**
         * Whether it should allow multiple selections, or not.
         */
        multiple: {
            type: Boolean,
            default: false
        },
        /**
         * How many options should be visible.
         */
        selectSize: {
            type: Number,
            default: 0
        },
        /**
         * Controls the `aria-invalid` attribute.
         */
        ariaInvalid: {
            type: [Boolean, String],
            default: false
        },
        /**
         * The value field.
         */
        valueField: {
            type: String,
            default: 'value'
        },
        /**
         * The disabled field.
         */
        disabledField: {
            type: String,
            default: 'disabled'
        },
        /**
         * The text field.
         */
        textField: {
            type: String,
            default: 'text'
        },
        /**
         * The disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The required state.
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * The validity state (invalid, valid, true, false).
         */
        state: {
            type: [Boolean, String],
            default: null,
            validator: v => ['valid', 'invalid', true, false, null].includes(v)
        },
        /**
         * The form control size (sm, lg).
         */
        size: {
            type: String,
            default: null,
            validator: v => ['sm', 'lg', null].includes(v)
        }
    },
    data() {
        return {
            localValue: this.value
        }
    },
    watch: {
        value(newVal) {
            this.localValue = newVal
        },

        localValue() {
            this.$emit('input', this.localValue)
        }
    },
    computed: {
        computedID() {
            return this.id || `dr-select-${guid()}`
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

        stateClass() {
            if (this.computedState === true) {
                return 'is-valid'
            } else if (this.computedState === false) {
                return 'is-invalid'
            }

            return null
        },

        computedAriaInvalid() {
            if (this.ariaInvalid === true || this.ariaInvalid === 'true') {
                return 'true';
            }

            return this.stateClass == 'is-invalid' ? 'true' : null;
        },

        formOptions() {
            let options = this.options || {}
            const valueField = this.valueField || 'value'
            const textField = this.textField || 'text'
            const disabledField = this.disabledField || 'disabled'

            // Parse array options
            if (Array.isArray(options)) {
                return options.map(option => {
                    if (typeof option === 'object') {
                        return {
                            value: option[valueField],
                            text: String(option[textField]),
                            disabled: option[disabledField] || false
                        }
                    }

                    return { text: String(option), value: option, disabled: false }
                })

            // Parse object options
            } else if (typeof options === 'object') {
                return Object.keys(options).map(key => {
                    let option = options[key] || {}

                    if (typeof option === 'object') {
                        const value = option[valueField]
                        const text = option[textField]

                        return {
                            text: typeof text === 'undefined' ? key : String(text),
                            value: typeof value === 'undefined' ? key : value,
                            disabled: option[disabledField] || false
                        }
                    }

                    return { text: String(option), value: key, disabled: false }
                })
            }

            return []
        }
    },
    methods: {
        handleChange(evt) {
            const target = evt.target;
            const selectedVal = Array.from(target.options)
                                    .filter(opt => opt.selected)
                                    .map(opt => '_value' in opt ? opt._value : opt.value)

            this.localValue = target.multiple ? selectedVal : selectedVal[0];
            this.$emit('change', this.localValue);
        }
    }
}
</script>

<style scoped>
    .custom-select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
</style>
