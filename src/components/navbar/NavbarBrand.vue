<template>
    <component :is="computedTag" v-bind="computedProps">
        <slot />
    </component>
</template>

<script>
import dLink from '../link/Link.vue'
import createLinkProps from '../link/create-link-props'

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
export default {
    name: 'd-navbar-brand',
    components: {
        dLink
    },
    props: {
        ...createLinkProps(), ...{
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            }
        }
    },
    computed: {
        computedTag() {
            // eslint-disable-next-line
            return Boolean(this.to || this.href) ? 'd-link' : this.tag
        },
        computedProps() {
            // eslint-disable-next-line
            return Boolean(this.to || this.href) ? this.$props : {}
        }
    }
}
</script>
