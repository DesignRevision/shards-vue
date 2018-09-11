<template>
    <li class="nav-item">
        <d-link v-bind="$props" class="nav-link">
            <slot />
        </d-link>
    </li>
</template>

<script>
import dLink from '../link/Link.vue'
import createLinkProps from '../link/create-link-props';

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
export default {
    name: 'd-nav-item',
    components: {
        dLink
    },
    props: createLinkProps()
}
</script>
