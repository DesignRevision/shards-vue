<template>
    <component :is="tag" :class="[
        'navbar-nav',
        fill ? 'nav-fill' : '',
        justified ? 'nav-justified' : ''
    ]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-navbar-nav',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'ul'
        },
        /**
         * Whether it should fill the entire space, or not.
         */
        fill: {
            type: Boolean,
            default: false
        },
        /**
         * Whether to proportionally fill all abailable space, or not.
         */
        justified: {
            type: Boolean,
            default: false
        }
    }
}
</script>
