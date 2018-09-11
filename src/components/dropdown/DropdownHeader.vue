<template>
    <component :is="tag"
        class="dropdown-header"
        :id="id">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-dropdown-header',
    props: {
        /**
         * The component tag.
         */
        tag: {
            type: String,
            default: 'h6'
        },
        /**
         * The component ID.
         */
        id: {
            type: String,
            default: null
        }
    }
}
</script>
