<template>
    <component :is="tag" class="form-row">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-form-row',
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

