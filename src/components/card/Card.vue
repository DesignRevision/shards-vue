<template>
    <component :is="tag"
        v-bind="$attrs"
        :class="[
            'card',
            Boolean(align) ? `text-${align}` : '',
            Boolean(bgTheme) ? `bg-${bgTheme}` : '',
            Boolean(borderTheme) ? `border-${borderTheme}` : '',
            Boolean(textTheme) ? `text-${textTheme}` : ''
        ]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-card',
    props: {
        /**
         * Element tag type.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Background theme color.
         */
        bgTheme: {
            type: String,
            default: null
        },
        /**
         * Border theme color.
         */
        borderTheme: {
            type: String,
            default: null
        },
        /**
         * Text theme color.
         */
        textTheme: {
            type: String,
            default: null
        },
        /**
         * Alignment
         */
        align: {
            type: String,
            default: null
        }
    }
}
</script>
