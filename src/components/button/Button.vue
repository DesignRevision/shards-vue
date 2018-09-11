<template>
    <button class="btn"
        @click="handleClick"
        :class="[
            themeClass,
            sizeClass,
            pill ? 'btn-pill' : '',
            squared ? 'btn-squared' : '',
            blockLevel ? 'btn-block' : '',
            active ? 'active' : ''
        ]"
        :disabled="this.disabled"
        :aria-pressed="this.active">
        <slot>Button</slot>
    </button>
</template>

<script>
import { THEMECOLORS } from '../../utils/constants'

export default {
    name: 'd-button',
    props: {
        /**
         * The theme style.
         */
        theme: {
            type: String,
            validator: v => THEMECOLORS.includes(v),
            default: 'primary'
        },
        /**
         * Whether it should be displayed as an outline, or not.
         */
        outline: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as a pill, or not.
         */
        pill: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as a squared, or not.
         */
        squared: {
            type: Boolean,
            default: false
        },
        /**
         * The button's sizesize.
         */
        size: {
            type: String,
            validator: v => ['sm', 'lg', null].includes(v),
            default: null
        },
        /**
         * Whether it should be displayed as block, or not.
         */
        blockLevel: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as disabled, or not.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as active, or not.
         */
        active: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        sizeClass() {
            if (this.size && this.size !== '') {
                return `btn-${this.size}`;
            }

            return this.size;
        },

        themeClass() {
            return this.theme ? `btn-${this.outline ? 'outline-' : ''}${this.theme}` : '';
        }
    },
    methods: {
        /**
         * Triggered when the button is clicked.
         *
         * @event click
         */
        handleClick(e) {
            this.$emit('click', e);
        }
    }
}
</script>
