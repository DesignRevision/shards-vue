<template>
    <d-link class="dropdown-item" role="menuitem" v-bind="$props">
        <slot />
    </d-link>
</template>

<script>
import createLinkProps from '../link/create-link-props'

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
export default {
    name: 'd-dropdown-item',
    props: {
        ...createLinkProps()
    }
}
</script>

<style scoped>
.dropdown-item:focus {
    outline: 0;
}
</style>
