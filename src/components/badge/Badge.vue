<template>
    <component :is="computedTag" :class="[
        'badge',
        theme && !outline ? `badge-${theme}` : '',
        outline ? `badge-outline-${theme}` : '',
        pill ? `badge-pill` : '',
    ]">
        <slot />
    </component>
</template>

<script>
import dLink from '../link/Link.vue'
import createLinkProps from '../link/create-link-props'
import { THEMECOLORS } from '../../utils/constants'

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
export default {
    name: 'd-badge',
    components: {
        dLink
    },
    props: {...createLinkProps(), ...{
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'span'
        },
        /**
         * The theme color.
         */
        theme: {
            type: String,
            default: 'primary',
            validator: v => THEMECOLORS.includes(v)
        },
        /**
         * Whether it should be displayed as a pill, or not.
         */
        pill: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed with an outline, or not.
         */
        outline: {
            type: Boolean,
            default: false
        }
    }},
    computed: {
        computedTag() {
            return this.href || this.to ? 'd-link' : this.tag
        }
    }
}
</script>
