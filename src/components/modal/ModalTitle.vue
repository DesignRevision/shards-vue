<template>
    <component :is="tag" class="modal-title">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-modal-title',
    props: {
        /**
         * The component's tag.
         */
        tag: {
            type: String,
            default: 'h5'
        }
    }
}
</script>

