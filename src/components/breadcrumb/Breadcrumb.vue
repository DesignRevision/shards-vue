<template>
    <ol class="breadcrumb">
        <BreadcrumbItem v-for="(item, index) in computedItems"
            :key="`dr-breadcrumb-${index}`"
            :active="item.active"
            :text="item.text"
            :href="item.href" />
        <slot />
    </ol>
</template>

<script>
import BreadcrumbItem from './BreadcrumbItem.vue'

export default {
    name: 'd-breadcrumb',
    components: {
        BreadcrumbItem
    },
    props: {
        /**
         * The breadcrumb items array.
         */
        items: {
            type: Array,
            default: null
        }
    },
    computed: {
        computedItems() {
            let isActiveDefined = false

            if (!this.items || !this.items.length) {
                return []
            }

            return this.items.map((item, idx) => {
                if (typeof item !== 'object') {
                    item = { text: item }
                }

                if (item.active) {
                    isActiveDefined = true
                }

                if (!item.active && !isActiveDefined) {
                    item.active = idx + 1 === this.items.length
                }

                return item
            })
        }
    }
}
</script>
