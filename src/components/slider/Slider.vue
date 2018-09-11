<template>
    <div class="shards-custom-slider" ref="slider" :id="computedID" />
</template>

<script>
import noUiSlider from 'nouislider'
import { guid } from '../../utils'

export default {
    name: 'd-slider',
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * Options config.
         */
        options: {
            type: Object,
            default() {
                return {}
            }
        },
        /**
         * Slider value.
         */
        value: {
            type: [String, Array, Number],
            required: true
        },
        /**
         * Start value.
         */
        start: {
            type: [Number, Array],
            default: 0
        },
        /**
         * Range configuration.
         */
        range: {
            type: Object,
            default() {
                return { min: 0, max: 100 }
            }
        },
        /**
         * Connect configuration.
         */
        connect: {
            type: [Boolean, Array],
            default() {
                return [true, false]
            }
        }
    },
    watch: {
        value(newVal, oldVal) {
            const sliderInstance = this.$el.noUiSlider
            const sliderValue = sliderInstance.get()

            if (newVal !== oldVal && sliderValue !== newVal) {
                if (Array.isArray(sliderValue) && Array.isArray(newVal)) {
                    if (
                        oldVal.length === newVal.length &&
                        oldVal.every((v, i) => v === newVal[i] )
                    ) {
                        sliderInstance.set(newVal)
                    }
                } else {
                    sliderInstance.set(newVal)
                }
            }
        }
    },
    computed: {
        computedID() {
            return this.id || `dr-slider-${guid()}`
        }
    },
    mounted() {
        const config = {
            start: this.value || this.start,
            connect: this.connect,
            range: this.range,
            ...this.options
        }

        noUiSlider.create(this.$el, config)

        this.$el.noUiSlider.on('slide', () => {
            const value = this.$el.noUiSlider.get()
            if (value !== this.value) {
                this.$emit('input', value)
            }
        })
    }
}
</script>
