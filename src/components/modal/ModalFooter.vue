<template>
    <component :is="tag" class="modal-footer">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-modal-footer',
    props: {
        /**
         * The component's tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    }
}
</script>

