<template>
    <component :is="computedTag"
        v-html="text"
        :aria-current="ariaCurrent"
        :href="href" />
</template>

<script>
import dLink from '../link/Link.vue'
import createLinkProps from '../link/create-link-props'

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
export default {
    name: 'd-breadcrumb-link',
    components: {
        dLink
    },
    props: {...createLinkProps(), ...{
        /**
         * The breadcrumb link text.
         */
        text: {
            type: String,
            default: null
        },
        /**
         * The active state.
         */
        active: {
            type: Boolean,
            default: false
        },
        /**
         * The href.
         */
        href: {
            type: String,
            default: '#'
        },
        /**
         * The aria-current state.
         */
        ariaCurrent: {
            type: String,
            default: 'location'
        }
    }},
    computed: {
        computedTag() {
            return this.active ? 'span' : 'd-link'
        }
    }
}
</script>
