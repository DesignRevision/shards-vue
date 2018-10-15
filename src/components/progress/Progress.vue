<template>
    <div :class="['progress', size ? `progress-${size}` : '']" :style="{ height: height || null }">
        <slot>
            <d-progress-bar v-bind="$props"/>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'd-progress',
    props: {
        /**
         * Theme color.
         */
        theme: {
            type: String,
            default: 'primary'
        },
        /**
         * Whether it should be striped, or not.
         */
        striped: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be animated, or not.
         */
        animated: {
            type: Boolean,
            default: false
        },
        /**
         * Height value.
         */
        height: {
            type: String,
            default: null
        },
        /**
         * Precision number of digits.
         */
        precision: {
            type: Number,
            default: 0
        },
        /**
         * Whether to show progress, or not.
         */
        showProgress: {
            type: Boolean,
            default: false
        },
        /**
         * Whether to show the value, or not.
         */
        showValue: {
            type: Boolean,
            default: false
        },
        /**
         * The maximum value.
         */
        max: {
            type: Number,
            default: 100
        },
        /**
         * The value.
         */
        value: {
            type: Number,
            default: 0
        },
        /**
         * The size.
         */
        size: {
            type: String,
            default: null,
            validator: (v) => ['sm', 'lg'].includes(v)
        }
    }
}
</script>

<style>
    /* Hide labels for small progress bars */
    .progress-sm span {
        color: transparent;
    }
</style>
