<template>
    <component :is="tag" :class="[
        'card-footer',
        Boolean(bgTheme) ? `bg-${bgTheme}` : '',
        Boolean(borderTheme) ? `border-${borderTheme}` : '',
        Boolean(textTheme) ? `text-${textTheme}` : '',
        footerClass
    ]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-card-footer',
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
         * Footer value.
         */
        footer: {
            type: String,
            default: null
        },
        /**
         * Footer class.
         */
        footerClass: {
            type: String,
            default: ''
        }
    }
}
</script>
