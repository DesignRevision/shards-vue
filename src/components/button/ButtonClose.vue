<template>
    <button :class="[ 'close', theme ? `text-${theme}` : '' ]"
        :disabled="disabled"
        :aria-label="ariaLabel"
        @click="handleClick">
        <slot>&times;</slot>
    </button>
</template>

<script>
export default {
    name: 'd-button-close',
    props: {
        /**
         * Whether it should be displayed as disabled, or not.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The theme color value.
         */
        theme: {
            type: String,
            default: null
        },
        /**
         * The aria-label value.
         */
        ariaLabel: {
            type: String,
            default: 'Close'
        }
    },
    methods: {
        handleClick(e) {
            if (this.disabled && e instanceof Event) {
                e.stopPropagation();
                e.preventDefault();
            }

            this.$emit('click', e);
        }
    }
}
</script>
