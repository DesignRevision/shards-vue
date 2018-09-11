<template>
    <component :is="tag" class="navbar-text">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-nav-text',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'span'
        }
    }
}
</script>

