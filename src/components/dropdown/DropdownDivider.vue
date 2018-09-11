<template>
    <component role="separator"
        class="dropdown-divier"
        :is="tag">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-dropdown-divider',
    props: {
        /**
         * The component tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    }
}
</script>
