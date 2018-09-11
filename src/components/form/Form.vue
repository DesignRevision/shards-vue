<template>
    <form :novalidate="novalidate ? true : false"
        v-bind="$attrs"
        v-on="$listeners"
        :class="[
            inline ? 'form-inline' : '',
            validated ? 'was-validated' : ''
        ]">
        <slot />
    </form>
</template>

<script>
export default {
    name: 'd-form',
    props: {
        /**
         * Whether it should be displayed inline, or not.
         */
        inline: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it is validated, or not.
         */
        validated: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be validated, or not.
         */
        novalidate: {
            type: Boolean,
            default: false
        }
    }
}
</script>
