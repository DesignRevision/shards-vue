<template>
    <component :is="tag"
        :class="[
            `${type}-feedback`,
            forceShow ? 'd-block' : ''
        ]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-form-feedback',
    props: {
        /**
         * The feedback tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * The feedback type.
         */
        type: {
            type: String,
            default: 'valid',
            validator: v => ['valid', 'invalid'].includes(v)
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
