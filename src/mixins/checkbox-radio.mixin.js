export default {
    data() {
        return {
            localChecked: this.checked,
            hasFocus: false
        }
    },
    model: {
        prop: 'checked',
        event: 'input'
    },
    props: {
        value: {},
        checked: {},
        buttonTheme: {
            type: String,
            default: null
        }
    },
    computed: {
        computedLocalChecked: {
            get() {
                this.isChild ? this.$parent.localChecked : this.localChecked
            },
            set (val) {
                if (this.isChild) {
                    this.$parent.localChecked = val
                    return
                }

                this.localChecked = val
            }
        },
        isChild() {
            return Boolean(this.$parent && this.$parent.is_RadioCheckGroup)
        },
        isDisabled() {
            return Boolean(this.isChild ? (this.$parent.disabled || this.disabled) : this.disabled)
        },
        isPlain() {
            return Boolean(this.isChild ? this.$parent.plain : this.plain)
        },
        getSize() {
            return this.isChild ? this.$parent.size : this.size
        },
        getState() {
            if (this.isChild && typeof this.$parent.getState === 'boolean') {
                return this.$parent.getState
            }

            return this.computedState
        },
        getStateClass() {
            return typeof this.getState === 'boolean' ? (this.getState ? 'is-valid' : 'is-invalid') : ''
        },
        isStacked() {
            return Boolean(this.isChild && this.$parent.stacked)
        },
        getButtonTheme() {
            return this.buttonTheme || (this.isChild ? this.$parent.buttonTheme : null) || 'secondary'
        },
        buttonClasses() {
            return [
                'btn',
                `btn-${this.getButtonTheme}`,
                this.getSize ? `btn-${this.getSize}` : '',
                this.isDisabled ? 'disabled' : '',
                this.hasFocus ? 'focus' : '',
                this.isStacked ? 'mb-0' : ''
            ]
        }
    }
  }
