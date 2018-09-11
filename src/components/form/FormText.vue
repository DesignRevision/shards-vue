<template>
    <component :is="tag"
        :class="[
            !inline ? 'form-text' : '',
            Boolean(theme) ? `text-${theme}` : ''
        ]">
        <slot />
    </component>
</template>

<script>
import { THEMECOLORS } from '../../utils/constants';

export default {
    name: 'd-form-text',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'small'
        },
        /**
         * The theme color.
         */
        theme: {
            type: String,
            default: 'secondary',
            validator: (v) => THEMECOLORS.includes(v)
        },
        /**
         * Whether it should be displayed inline, or not.
         */
        inline: {
            type: Boolean,
            default: false
        }
    }
}
</script>
