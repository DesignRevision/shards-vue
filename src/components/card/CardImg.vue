<template>
    <img :class="computedClass" :src="src" :alt="alt" />
</template>

<script>
export default {
    name: 'd-card-img',
    props: {
        /**
         * The image source.
         */
        src: {
            type: String,
            default: null,
            required: true
        },
        /**
         * Alternative image text.
         */
        alt: {
            type: String,
            default: null
        },
        /**
         * Top positioned.
         */
        top: {
            type: Boolean,
            default: false
        },
        /**
         * Bottom positioned.
         */
        bottom: {
            type: Boolean,
            default: false
        },
        /**
         * Fluid display.
         */
        fluid: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedClass() {
            let _classList = []

            _classList.push(this.fluid ? 'img-fluid' : '')

            if (this.top && !this.bottom) {
                _classList.push('card-img-top')
            }

            if (this.bottom && !this.top) {
                _classList.push('card-img-bottom')
            }

            return _classList
        }
    }
}
</script>
