<template>
    <component :is="tag"
        :class="[
            !fluid ? 'container' : 'container-fluid'
        ]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-container',
    props: {
        /**
         * Container element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether the container is fluid or not.
         */
        fluid: {
            type: Boolean,
            default: false
        }
    }
}
</script>

