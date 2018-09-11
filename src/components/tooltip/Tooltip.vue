<template>
    <div class="d-none" style="display: none;" aria-hiden="true">
        <div ref="title">
            <slot />
        </div>
    </div>
</template>

<script>
import Tooltip from '../../utils/tooltip.class'
import TooltipPopoverMixin from '../../mixins/tooltip-popover.mixin'
import { TP_PLACEMENTS } from '../../utils/constants'

export default {
    name: 'd-tooltip',
    mixins: [ TooltipPopoverMixin ],
    props: {
        /**
         * Title.
         */
        title: {
            type: String,
            default: ''
        },
        /**
         * Triggers.
         */
        triggers: {
            type: [String, Array],
            default: 'hover focus'
        },
        /**
         * Placement.
         */
        placement: {
            type: String,
            default: 'top',
            validator: val => Object.keys(TP_PLACEMENTS).map(p => p.toLowerCase()).includes(val)
        },
        /**
         * The target element.
         */
        target: {
            type: [String, Object, Function]
        },
        /**
         * Delay in miliseconds.
         */
        delay: {
            type: [Number, Object, String],
            default: 0
        },
        /**
         * Offset.
         */
        offset: {
            type: [Number, String]
        },
        /**
         * Disable animations.
         */
        noFade: {
            type: Boolean,
            default: false
        },
        /**
         * Wrapping container.
         */
        container: {
            type: String,
            default: null
        },
        /**
         * Instance boundaries.
         */
        boundary: {
            type: [String, Object],
            default: 'scrollParent'
        },
        /**
         * Show state.
         */
        show: {
            type: Boolean,
            default: false
        },
        /**
         * Disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        /**
         * Gets the target and if the target exists, it initializes the Tooltip.
         * Used inside the TooltipPopoverMixin
         */
        bootstrap() {
            const target = this.getTarget()

            if (target) {
                this._TPInstance = new Tooltip(
                    target,
                    this.getUpdatedConfig(),
                    this.$root
                )
            }

            return this._TPInstance
        }
    }
}
</script>
