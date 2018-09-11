<template>
    <component :is="tag"
        class="row"
        :class="[
            noGutters ? 'no-gutters' : '',
            alignV ? `align-items-${alignV}` : '',
            alignH ? `justify-content-${alignH}` : '',
            alignContent ? `align-content-${alignContent}` : ''
        ]">
        <slot />
    </component>
</template>

<script>
const ALIGNMENT = ['start', 'end', 'center'];

/**
 * The row subcomponent.
 */
export default {
    name: 'd-row',
    props: {
        /**
         * Row element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether to remove gutters, or not.
         */
        noGutters: {
            type: Boolean,
            default: false
        },
        /**
         * Align items vertically.
         */
        alignV: {
            type: String,
            default: null,
            validator: v => ALIGNMENT.concat(['baseline', 'stretch']).includes(v)
        },
        /**
         * Justify content horizontally.
         */
        alignH: {
            type: String,
            default: null,
            validator: v => ALIGNMENT.concat(['between', 'around']).includes(v)
        },
        /**
         * Align content.
         */
        alignContent: {
            type: String,
            default: null,
            validator: v => ALIGNMENT.concat(['between', 'around', 'stretch']).includes(v)
        }
    }
}
</script>

