<template>
    <component :is="tag" :class="[
        'card-body',
        overlay ? 'card-img-overlay' : '',
        Boolean(bgTheme) ? `bg-${bgTheme}` : '',
        Boolean(borderTheme) ? `border-${borderTheme}` : '',
        Boolean(textTheme) ? `text-${textTheme}` : '',
        bodyClass
    ]">
        <component :is="titleTag" v-if="title" class="card-title" v-html="title" />
        <component :is="subtitleTag" v-if="subtitle" class="card-subtitle mb-2 text-muted" v-html="subtitle"/>
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-card-body',
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
         * Body class.
         */
        bodyClass: {
            type: String,
            default: ''
        },
        /**
         * Body title value.
         */
        title: {
            type: String,
            default: null
        },
        /**
         * Body title element tag type.
         */
        titleTag: {
            type: String,
            default: 'h4'
        },
        /**
         * Body subtitle value.
         */
        subtitle: {
            type: String,
            default: null
        },
        /**
         * Body subtitle element tag type.
         */
        subtitleTag: {
            type: String,
            default: 'h6'
        },
        /**
         * Overlay.
         */
        overlay: {
            type: Boolean,
            default: false
        }
    }
}
</script>
