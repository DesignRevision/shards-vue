<template>
    <component :is="tag"
        :id="id"
        :class="[
            'valid-feedback',
            forceShow ? 'd-block' : ''
        ]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-form-valid-feedback',
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether it should be forcefully shown, or not.
         */
        forceShow: {
            type: Boolean,
            default: false
        }
    }
}
</script>
