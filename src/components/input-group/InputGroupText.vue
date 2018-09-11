<template>
    <component :is="tag" class="input-group-text">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-input-group-text',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    }
}
</script>
