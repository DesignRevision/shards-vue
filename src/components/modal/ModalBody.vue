<template>
    <component :is="tag" class="modal-body">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-modal-body',
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
