<template>
    <component :is="tag"
        :class="[
            'embed-responsive',
            `embed-responsive-${aspect}`
        ]">
        <component :is="type"
            class="embed-responsive-item"
            v-bind="$attrs">
            <slot />
        </component>
    </component>
</template>

<script>
import { EMBED_TYPES, EMBED_ASPECTS } from './../../utils/constants'

export default {
    name: 'd-embed',
    props: {
        /**
         * The embed type.
         */
        type: {
            type: String,
            default: 'iframe',
            validator: v => EMBED_TYPES.includes(v)
        },
        /**
         * The embed tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * The embed aspect ratio.
         */
        aspect: {
            type: String,
            default: '16by9',
            validator: v => EMBED_ASPECTS.includes(v)
        }
    }
}
</script>

