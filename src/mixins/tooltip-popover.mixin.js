import DOMObserver from './../utils/observer'
import { isElement, isArray, getById } from './../utils'
import { TP_PLACEMENTS } from './../utils/constants'

export default {
    /**
     * Watch the show and disabled props and handle each case accordingly.
     */
    watch: {
        show (show, oldShow) {
            if (show === oldShow) {
                return
            }

            show ? this._handleShow() : this._handleHide()
        },
        disabled (disabled, oldDisabled) {
            if (disabled === oldDisabled) {
                return
            }

            disabled ? this._handleDisable() : this._handleEnable()
        }
    },

    /**
     * Setup initial values after the instance is created.
     */
    created() {
        this._TPInstance = null
        this._obs_title = null
        this._obs_content = null
    },

    /**
     * Bootstrap the Tooltip/Popover after the instance is mounted.
     */
    mounted() {
        this.$nextTick(() => {
            // The Tooltip/Popover instance is defined in each individual component
            const TPInstance = this.bootstrap()

            // If there's no TPInstance it means that there's no target, so just return here
            if (!TPInstance) {
                return
            }

            this._enableDOMObserver()

            if (this.disabled) {
                this._handleDisable()
            }

            if (this.show) {
                this._handleShow()
            }
        })
    },

    /**
     * Update the config when data changes.
     */
    updated() {
        if (!this._TPInstance) {
            return
        }

        this._TPInstance.updateConfig(this.getUpdatedConfig())
    },

    /**
     * Setup the observers.
     */
    activated() {
        this._enableDOMObserver()
    },

    /**
     * Disable the observers and hide the instance.
     */
    deactivated() {
        if (this._TPInstance) {
            this._disableDOMObserver()
            this._TPInstance.hide()
        }
    },

    /**
     * Clean up everything before the instance is destroyed.
     */
    beforeDestroy() {
        this._disableDOMObserver()

        if (this._TPInstance) {
            this._TPInstance.destroy()
            this._TPInstance = null
        }
    },

    computed: {
        baseConfig() {
            const title = (this.title || '').trim()
            const content = (this.content || '').trim()
            const placement = TP_PLACEMENTS[this.placement.toUpperCase()] || 'auto'
            const container = this.container || false
            const boundary = this.boundary
            const delay = (typeof this.delay === 'object') ? this.delay : (parseInt(this.delay, 10) || 0)
            const offset = this.offset || 0
            const animation = !this.noFade
            const trigger = isArray(this.triggers) ? this.triggers.join(' ') : this.triggers

            const callbacks = {
                show: this._emitShowEvent,
                shown: this._emitShownEvent,
                hide: this._emitHideEvent,
                hidden: this._emitHiddenEvent,
                enabled: this._emitEnabledEvent,
                disabled: this._emitDisabledEvent
            }

            return {
                title,
                content,
                placement,
                container,
                boundary,
                delay,
                offset,
                animation,
                trigger,
                callbacks
            }
        }
    },

    methods: {

        /*--------------------------------------------------------------------------
        /* PUBLIC
        /*--------------------------------------------------------------------------*/

        /**
         * Returns the target element.
         */
        getTarget() {
            let _target = null

            switch (typeof this.target) {
                case 'function':
                    _target = this.target()
                    break
                case 'string':
                    _target = getById(this.target)
                    break
                case 'object':
                    if (isElement(this.target.$el)) {
                        _target = this.target.$el
                    } else if (isElement(this.target)) {
                        _target = this.target
                    }
                    break
            }

            return _target
        },

        /**
         * Returns the updated config.
         */
        getUpdatedConfig() {
            const updatedConfig = { ...this.baseConfig }

            // override title if slot is used
            if (this.$refs.title) {
                updatedConfig.title = this.$refs.title
                updatedConfig.html = true
            }

            // override content if slot is used
            if (this.$refs.content) {
                updatedConfig.content = this.$refs.content
                updatedConfig.html = true
            }

            return updatedConfig
        },

        /*--------------------------------------------------------------------------
        /* PRIVATE
        /*--------------------------------------------------------------------------*/

        _handleShow() {
            if (this._TPInstance) {
                this._TPInstance.show()
            }
        },

        _handleHide(callback) {
            if (this._TPInstance) {
                this._TPInstance.hide(callback)
            } else if (typeof callback === 'function') {
                callback()
            }
        },

        _handleDisable() {
            if (this._TPInstance) {
                this._TPInstance.disable()
            }
        },

        _handleEnable() {
            if (this._TPInstance) {
                this._TPInstance.enable()
            }
        },

        _emitShowEvent(event) {
            this.$emit('show', event)
        },

        _emitShownEvent(event) {
            this._enableDOMObserver()

            this.$emit('update:show', true)
            this.$emit('shown', event)
        },

        _emitHideEvent(event) {
            this.$emit('hide', event)
        },

        _emitHiddenEvent(event) {
            this._disableDOMObserver()

            this.$emit('update:show', false)
            this.$emit('hidden', event)
        },

        _emitEnabledEvent(event) {
            if (!event || event.type !== 'enabled') {
                return
            }

            this.$emit('update:disabled', false)
            this.$emit('disabled')
        },

        _emitDisabledEvent(event) {
            if (!event || event.type !== 'disabled') {
                return
            }

            this.$emit('update:disabled', true)
            this.$emit('enabled')
        },

        _updatePosition() {
            if (this._TPInstance) {
                this._TPInstance.update()
            }
        },

        _enableDOMObserver() {
            if (this.$refs.title) {
                this._obs_title = DOMObserver(
                    this.$refs.title,
                    this._updatePosition.bind(this)
                )
            }

            if (this.$refs.content) {
                this._obs_content = DOMObserver(
                    this.$refs.content,
                    this._updatePosition.bind(this)
                )
            }
        },

        _disableDOMObserver() {
            if (this._obs_title) {
                this._obs_title.disconnect()
                this._obs_title = null
            }

            if (this._obs_content) {
                this._obs_content.disconnect()
                this._obs_content = null
            }
        }
    }
}
