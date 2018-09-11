<template>
    <div :class="[
        'progress-bar',
        computedTheme ? `bg-${computedTheme}` : '',
        (computedStriped || computedAnimated) ? 'progress-bar-striped' : '',
        computedAnimated ? 'progress-bar-animated' : ''
    ]"
    :style="{ width: (100 * (value / computedMax)) + '%' }"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="computedMax.toString()"
    :aria-valuenow="value.toFixed(computedPrecision)">
        <slot>
            <span v-if="label" v-html="label"></span>
            <span v-if="computedShowProgress">{{ computedProgress.toFixed(computedPrecision) }}</span>
            <span v-if="computedShowValue">{{ value.toFixed(computedPrecision) }}</span>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'd-progress-bar',
    props: {
        /**
         * The value.
         */
        value: {
            type: Number,
            default: 0
        },
        /**
         * The label.
         */
        label: {
            type: String,
            value: null
        },
        /**
         * The max value.
         */
        max: {
            type: Number,
            default: null
        },
        /**
         * Precision number of digits.
         */
        precision: {
            type: Number,
            default: null
        },
        /**
         * Theme color.
         */
        theme: {
            type: String,
            default: null
        },
        /**
         * Whether it should be striped, or not.
         */
        striped: {
            type: Boolean,
            default: null
        },
        /**
         * Whether it should be animated, or not.
         */
        animated: {
            type: Boolean,
            default: null
        },
        /**
         * Whether it should show the progress, or not.
         */
        showProgress: {
            type: Boolean,
            default: null
        },
        /**
         * Whether it should show the value, or not.
         */
        showValue: {
            type: Boolean,
            default: null
        }
    },
    computed: {
        computedTheme() {
            return this.theme || this.$parent.theme
        },
        computedStriped() {
            return typeof this.striped === 'boolean' ? this.striped : (this.$parent.striped || false)
        },
        computedAnimated() {
            return typeof this.animated === 'boolean' ? this.animated : (this.$parent.animated || false)
        },
        computedMax() {
            return typeof this.max === 'number' ? this.max : (this.$parent.max || 100)
        },
        computedPrecision() {
            return typeof this.precision === 'number' ? this.precision : (this.$parent.precision || 0)
        },
        computedShowProgress() {
            return typeof this.showProgress === 'boolean' ? this.showProgress : (this.$parent.showProgress || false)
        },
        computedShowValue() {
            return typeof this.showValue === 'boolean' ? this.showValue : (this.$parent.showValue || false)
        },
        computedProgress() {
            const p = Math.pow(10, this.computedPrecision)
            return Math.round((100 * p * this.value) / this.computedMax) / p
        }
    }
}
</script>

<style scoped>
.progress-bar {
    height: 100%;
}
</style>
