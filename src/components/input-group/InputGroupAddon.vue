<template>
    <component :is="tag"
        :id="id"
        :class="[ `input-group-${append ? 'append' : 'prepend'}` ]">
        <InputGroupText v-if="isText">
            <slot />
        </InputGroupText>
        <slot v-if="!isText" />
    </component>
</template>

<script>
import InputGroupText from './InputGroupText.vue'

export default {
    name: 'd-input-group-addon',
    components: {
        InputGroupText
    },
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * The append value.
         */
        append: {
            type: Boolean,
            default: false
        },
        /**
         * The prepend value.
         */
        prepend: {
            type: Boolean,
            default: false
        },
        /**
         * Whether is plain-text, or not.
         */
        isText: {
            type: Boolean,
            default: false
        }
    }
}
</script>
