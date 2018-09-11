<template>
    <img :src="src"
        :alt="alt"
        :width="computedWidth"
        :height="computedHeight"
        :class="[
            thumbnail ? 'img-thumbnail' : '',
            fluid || fluidGrow ? 'img-fluid' : '',
            fluidGrow ? 'w-100' : '',
            rounded ? 'rounded' : '',
            center ? 'd-block' : '',
            Boolean(computedAlign) ? computedAlign : '',
        ]"
        />
</template>

<script>
export default {
    name: 'd-image',
    props: {
        /**
         * The image source.
         */
        src: {
            type: String,
            default: null
        },
        /**
         * The image alternative text.
         */
        alt: {
            type: String,
            default: null
        },
        /**
         * The image width.
         */
        width: {
            type: [Number, String],
            default: null
        },
        /**
         * The image height.
         */
        height: {
            type: [Number, String],
            default: null
        },
        /**
         * Whether the image should be fluid, or not.
         */
        fluid: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should take up the entire space (in width).
         */
        fluidGrow: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be rounded.
         */
        rounded: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be displayed as a thumbnail.
         */
        thumbnail: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be floated to the left.
         */
        left: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be floated to the right.
         */
        right: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be centered.
         */
        center: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedWidth() {
            return parseInt(this.width, 10) || null
        },
        computedHeight() {
            return parseInt(this.height, 10) || null
        },
        computedAlign() {
            if (this.center) {
                return 'mx-auto'
            }

            if (this.left) {
                return 'float-left'
            }

            if (this.right) {
                return 'float-right'
            }
        }
    }
}
</script>

