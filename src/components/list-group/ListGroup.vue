<template>
    <component :is="tag" :class="[
        'list-group',
        flush ? 'list-group-flush' : ''
    ]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-list-group',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether the list group should be flushed, or not.
         */
        flush: {
            type: Boolean,
            default: false
        }
    }
}
</script>
