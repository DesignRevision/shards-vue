<template>
    <component :is="tag" :class="[
        'nav',
        tabs ? 'nav-tabs' : '',
        pills ? 'nav-pills' : '',
        vertical ? 'flex-column' : '',
        fill ? 'nav-fill' : '',
        justified ? 'nav-justified' : ''
    ]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-nav',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'ul'
        },
        /**
         * Fill all available space.
         */
        fill: {
            type: Boolean,
            default: false
        },
        /**
         * Define equal width elements.
         */
        justified: {
            type: Boolean,
            default: false
        },
        /**
         * Display as tabs.
         */
        tabs: {
            type: Boolean,
            default: false
        },
        /**
         * Display as pills.
         */
        pills: {
            type: Boolean,
            default: false
        },
        /**
         * Display vertical.
         */
        vertical: {
            type: Boolean,
            default: false
        }
    }
}
</script>
