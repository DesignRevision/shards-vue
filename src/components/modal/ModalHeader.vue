<template>
    <component :is="tag" class="modal-header">
        <slot />
        <d-btn-close v-if="close" @click.prevent="away" />
    </component>
</template>

<script>
import dBtnClose from '../button/ButtonClose.vue'

export default {
    name: 'd-modal-header',
    components: {
        dBtnClose
    },
    props: {
        /**
         * The component's tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether to display the close button, or not.
         */
        close: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        away() {
            this.$parent.$emit('close');
        }
    }
}
</script>

