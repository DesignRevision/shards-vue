<template>
    <li :class="[ 'breadcrumb-item', active ? 'active' : '' ]" role="presentation">
        <BreadcrumbLink :text="text"
            :href="href"
            v-if="!active" />
        <span v-if="active">{{ text }}</span>
    </li>
</template>

<script>
import BreadcrumbLink from './BreadcrumbLink.vue'

export default {
    name: 'd-breadcrumb-item',
    components: {
        BreadcrumbLink
    },
    props: {
        /**
         * The breadcrumb item text.
         */
        text: {
            type: String,
            default: null
        },
        /**
         * The breadcrumb item href.
         */
        href: {
            type: String,
            default: '#'
        },
        /**
         * Whether it is active, or not.
         */
        active: {
            type: Boolean,
            default: false
        }
    }
}
</script>
