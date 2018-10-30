<template>
    <component v-bind="$props"
        :is="computedTag"
        :rel="computedRel"
        :href="computedHref"
        :target="target"
        :to="to"
        :tabindex="computedTabindex"
        :class="[
            active ? (exact ? exactActiveClass : activeClass) : '',
            disabled ? 'disabled' : ''
        ]"
        :aria-disabled="computedAriaDisabled"
        @click.native="handleClick">
        <slot>Link</slot>
    </component>
</template>

<script>
import { LINK_EVENTS } from '../../utils/constants';
import rootListenerMixin from '../../mixins/root-listener.mixin'

export default {
    name: 'd-link',
    mixins: [ rootListenerMixin ],
    props: {
        /**
         * The link href.
         */
        href: {
            type: String,
            default: null
        },
        /**
         * The router location.
         */
        to: {
            type: [String, Object],
            default: null
        },
        /**
         * Whether the link is disabled, or not.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The link target.
         */
        target: {
            type: String,
            default: '_self'
        },
        /**
         * The link rel.
         */
        rel: {
            type: String,
            default: null
        },
        /**
         * Whether the route is exact, or not.
         */
        exact: {
            type: Boolean,
            default: false
        },
        /**
         * The class name attached when the route is exact,
         */
        exactActiveClass: {
            type: String
        },
        /**
         * Whether the link is active, or not.
         */
        active: {
            type: Boolean,
            default: false
        },
        /**
         * The class applied when the link is active.
         */
        activeClass: {
            type: String
        },
        /**
         * The component tag.
         */
        tag: {
            type: String,
            default: 'a'
        }
    },
    computed: {
        computedTag() {
            return this.to
                && !this.disabled
                && Boolean(this.$parent.$router) ? 'router-link' : 'a'
        },
        computedRel() {
            return this.target === '_blank'
                && this.rel === null ? 'noopener' : this.rel || null
        },
        computedHref() {
            if (this.computedTag === 'router-link') {
                return;
            }

            if (this.href) {
                return this.href;
            }

            if (this.to) {
                if (typeof this.to === 'string') {
                    return this.to;
                }

                if (typeof this.to === 'object' && this.to.path) {
                    return this.to.path;
                }
            }

            return '#';
        },
        computedTabindex() {
            return this.disabled ? '-1' : (this.$attrs ? this.$attrs.tabindex : null);
        },
        computedAriaDisabled() {
            return (this.tag === 'a' && this.disabled) ? 'true' : null;
        }
    },
    methods: {
        handleClick(event) {
            const isRouterLink = this.computedTag === 'router-link';

            if (this.disabled && event instanceof Event) {
                event.stopPropagation();
                event.stopImmediatePropagation();
            } else {
                if (isRouterLink && event.target.__vue__) {
                    event.target.__vue__.$emit('click', event);
                } else {
                    this.$emit('click', event);
                }

                this.emitOnRoot(LINK_EVENTS.CLICKED, event);
            }

            if ((!isRouterLink && this.computedHref === '#') || this.disabled) {
                event.preventDefault();
            }
        }
    }
}
</script>
