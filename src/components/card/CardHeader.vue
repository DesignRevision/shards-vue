<template>
    <component :is="tag" :class="[
        'card-header',
        Boolean(bgTheme) ? `bg-${bgTheme}` : '',
        Boolean(borderTheme) ? `border-${borderTheme}` : '',
        Boolean(textTheme) ? `text-${textTheme}` : '',
        headerClass
    ]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-card-header',
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
         * Header value.
         */
        header: {
            type: String,
            default: null
        },
        /**
         * Header class.
         */
        headerClass: {
            type: String,
            default: ''
        }
    }
}
</script>
