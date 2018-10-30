<template>
    <component :is="computedTag" :id="computedID"
        v-on-clickaway="away"
        :class="[
            'dropdown',
            'd-dropdown',
            !isNav ? 'btn-group' : '',
            isNav ? 'nav-item' : '',
            dropup ? 'dropup' : '',
            visible ? 'show' : '',
            (boundary !== 'scrollParent' || !boundary) ? 'position-static' : ''
        ]">

        <!-- Dropdown Split -->
        <d-button v-if="split && !isNav"
            ref="button"
            :disabled="disabled"
            :theme="theme"
            :size="size"
            :id="computedSplitID"
            @click="click">
            <slot name="button-content">{{ text }}</slot>
        </d-button>

        <!-- Dropdown Toggle -->
        <component :is="computedToggleTag" ref="toggle"
            :id="computedToggleID"
            :class="[
                isNav ? 'nav-link' : '',
                !noCaret || split ? 'dropdown-toggle' : '',
                split && !isNav ? 'dropdown-toggle-split' : '',
                toggleClass
            ]"
            :theme="theme"
            :size="size"
            :disabled="disabled"
            :aria-expanded="visible ? 'true' : 'false'"
            aria-haspopup="true"
            @click="toggle"
            @keydown="toggle">
            <span v-if="split" class="sr-only">{{ toggleText }}</span>
            <slot v-else name="button-content">{{ text }}</slot>
        </component>

        <!-- Dropdown Menu -->
        <div ref="menu"
            role="menu"
            :class="[
                'dropdown-menu',
                right ? 'dropdown-menu-right' : '',
                visible ? 'show' : '',
                menuClass
            ]"
            :id="computedMenuID"
            :aria-labeledby="computedMenuID"
            @mouseover="onMouseOver">
            <slot />
        </div>
    </component>
</template>

<script>
import Popper from 'popper.js'
import { guid, closest } from '../../utils'
import { THEMECOLORS, DROPDOWN_EVENTS, KEYCODES, LINK_EVENTS } from '../../utils/constants'
import { CancelableEvent } from '../../utils/events'
import { mixin as clickAwayMixin } from 'vue-clickaway';
import rootListenerMixin from '../../mixins/root-listener.mixin'

export default {
    name: 'd-dropdown',
    mixins: [
        rootListenerMixin,
        clickAwayMixin
    ],
    data() {
        return {
            visible: false,
            isNavbar: null,
            visibleChangePrevented: false
        }
    },
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The dropdown menu ID.
         */
        menuId: {
            type: String,
            default: null
        },
        /**
         * The toggle ID.
         */
        toggleId: {
            type: String,
            default: null
        },
        /**
         * The dropdown menu class(es).
         */
        menuClass: {
            type: [String, Array],
            default: null
        },
        /**
         * The dropdown toggle class(es).
         */
        toggleClass: {
            type: [String, Array],
            default: null
        },
        /**
         * Align the menu to the right.
         */
        right: {
            type: Boolean,
            default: false
        },
        /**
         * Whether to display the caret, or not.
         */
        noCaret: {
            type: Boolean,
            default: false
        },
        /**
         * Whether to split the dropdown, or not.
         */
        split: {
            type: Boolean,
            default: false
        },
        /**
         * The color theme.
         */
        theme: {
            type: String,
            default: 'primary',
            validator: v => THEMECOLORS.includes(v)
        },
        /**
         * The dropdown toggle's size.
         */
        size: {
            type: String,
            default: null
        },
        /**
         * The dropdown's disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The dropdown toggle's text.
         */
        toggleText: {
            type: String,
            default: 'Toggle Dropdown'
        },
        /**
         * The button label's text.
         */
        text: {
            type: String,
            default: ''
        },
        /**
         * The dropdown's boundary.
         */
        boundary: {
            type: String,
            default: 'scrollParent',
            validator: v => ['scrollParent', 'window', 'viewport'].includes(v)
        },
        /**
         * The offset value.
         */
        offset: {
            type: [Number, String],
            default: null
        },
        /**
         * Display on top.
         */
        dropup: {
            type: Boolean,
            default: false
        },
        /**
         * The Popper options.
         */
        popperOptions: {
            type: Object,
            default() {
                return {}
            }
        },
        /**
         * Disable autoflipping.
         */
        noFlip: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the dropdown is displayed inside a nav, or not.
         */
        isNav: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        visible(newVal, oldVal) {
            if (this.visibleChangePrevented) {
                this.visibleChangePrevented = false
                return
            }

            if (newVal === oldVal) {
                return
            }

            const eventName = newVal ? 'show' : 'hide'
            let _visibleChangeEvent = new CancelableEvent(eventName, {
                cancelable: true,
                vueTarget: this,
                target: this.$refs.menu,
                relatedTarget: null
            })

            this.$emit(_visibleChangeEvent.type, _visibleChangeEvent)
            this.emitOnRoot(DROPDOWN_EVENTS[_visibleChangeEvent.type.toUpperCase()])

            if (_visibleChangeEvent.defaultPrevented) {
                this.visibleChangePrevented = true
                this.visible = oldVal
                return
            }

            if (eventName === 'show') {
                this.showMenu()
                return
            }

            this.hideMenu()
        },
        disabled(newVal, oldVal) {
            if (newVal !== oldVal && newVal && this.visible) {
                this.visible = false
            }
        }
    },
    computed: {
        computedTag() {
            return this.isNav ? 'li' : 'div'
        },
        computedToggleTag() {
            return this.isNav ? 'a' : 'd-button'
        },
        computedID() {
            return this.id || `d-dropdown-${guid()}`
        },
        computedMenuID() {
            return this.menuId || `d-dropdown-menu-${guid()}`
        },
        computedToggleID() {
            return this.toggleId || `d-dropdown-toggle-${guid()}`
        },
        computedSplitID() {
            return this.splitId || `d-dropdown-split-${guid()}`
        },
        toggler() {
            return this.$refs.toggle.$el || this.$refs.toggle
        }
    },
    methods: {
        onMouseOver(event) {
            const item = event.target
            if (
                item.classList.contains('dropdown-item')
                && !item.disabled
                && !item.classList.contains('disabled')
                && item.focus
            ) {
                item.focus()
            }
        },
        toggle(event) {
            event = event || {}

            // Enter, Space or Down
            const KEY_ESD = event.keyCode === KEYCODES.ENTER
                            || event.keyCode === KEYCODES.SPACE
                            || event.keyCode === KEYCODES.DOWN

            if (event.type !== 'click' && !(event.type === 'keydown' && KEY_ESD)) {
                return
            }

            if (this.disabled) {
                this.visible = false
                return
            }

            this.$emit('toggle', event)

            if (event.defaultPrevented) {
                return
            }

            event.preventDefault()
            event.stopPropagation()

            this.visible = !this.visible
        },
        click(event) {
            if (this.disabled) {
                this.visible = false
                return
            }
            this.$emit('click', event)
        },
        createPopper(element) {
            this.removePopper()

            // Define placement
            let placement = 'bottom-start'

            if (this.dropup && this.right) {
                placement = 'top-end'
            } else if (this.dropup) {
                placement = 'top-start'
            } else if (this.right) {
                placement = 'bottom-end'
            }

            // Build Popper config
            const popperConfig = {
                placement,
                modifiers: {
                    offset: {
                        offset: this.offset || 0
                    },
                    flip: {
                        enabled: !this.noFlip
                    },
                    computeStyle: {
                        enabled: true
                    }
                }
            }

            // Define Popper boundaries
            if (this.boundary) {
                popperConfig.modifiers.preventOverflow = {
                    boundariesElement: this.boundary
                }
            }

            // Create Popper instance
            this._popperInstance = new Popper(
                element,
                this.$refs.menu,
                {
                    ...popperConfig,
                    ...this.popperOptions
                }
            )
        },
        removePopper() {
            if (this._popper) {
                this._popper.destroy()
            }
            this._popperInstance = null
        },
        showMenu() {
            if (this.disabled) {
                return
            }

            this.emitOnRoot(DROPDOWN_EVENTS.SHOWN, this)

            if (this.inNavbar === null && this.isNav) {
                this.inNavbar = Boolean(closest('.navbar', this.$el))
            }

            if (!this.inNavbar) {
                let _element = ((this.dropup && this.right) || this.split) ? this.$el : this.$refs.toggle
                _element = _element.$el || _element
                this.createPopper(_element)
            }

            this.$emit('shown')
            this.$nextTick(this.focusFirstItem)
        },
        hideMenu() {
            this.emitOnRoot(DROPDOWN_EVENTS.HIDDEN, this)
            this.$emit('hidden')
            this.removePopper()
        },
        away() {
            this.visible = false
        }
    },
    created() {
        this._popperInstance = null
    },
    mounted() {
        this.listenOnRoot(DROPDOWN_EVENTS.SHOWN, function(vm) {
            if (vm !== this) {
                this.visible = false
            }
        })

        this.listenOnRoot(LINK_EVENTS.CLICKED, this.away)
    },
    deactivated() {
        this.visible = false
        this.removePopper()
    },
    beforeDestroy() {
        this.visible = false
        this.removePopper()
    }
}
</script>

<style scoped>
.nav-link:hover {
    cursor: pointer;
}
</style>
