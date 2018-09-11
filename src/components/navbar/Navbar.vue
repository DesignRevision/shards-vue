<template>
    <component :is="tag" :class="[
        'navbar',
        type ? `navbar-${type}` : '',
        theme ? `bg-${theme}` : '',
        fixed ? `fixed-${fixed}` : '',
        sticky ? 'sticky-top' : '',
        toggleable ? `navbar-expand-${(toggleable ? 'sm' : toggleable) || 'sm'}` : ''
    ]">
        <slot />
    </component>
</template>

<script>
import { THEMECOLORS } from '../../utils/constants';

export default {
    name: 'd-navbar',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'nav'
        },
        /**
         * The navbar type.
         */
        type: {
            type: String,
            default: 'light'
        },
        /**
         * The theme color.
         */
        theme: {
            type: String,
            validator: v => THEMECOLORS.includes(v)
        },
        /**
         * Whether the navbar is toggleable, or not. Also accepts String for breakpoint definition.
         */
        toggleable: {
            type: [String, Boolean],
            default: false
        },
        /**
         * Fix the navbar to either `top` or `bottom`.
         */
        fixed: {
            type: String
        },
        /**
         * Whether the navbar should be sticky.
         */
        sticky: {
            type: Boolean,
            default: false
        }
    }
}
</script>
