<template>
    <component :is="tag" :class="computedClass">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'd-card-group',
    props: {
        /**
         * Component tag type.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether it should be displayed as a deck, or not.
         */
        deck: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as columns, or not.
         */
        columns: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedClass() {
            if (this.columns) {
                return 'card-columns'
            }

            if (this.deck) {
                return 'card-deck'
            }

            return 'card-group'
        }
    }
}
</script>
