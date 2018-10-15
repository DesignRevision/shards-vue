<template>
    <component :is="tag"
        role="group"
        :id="id"
        :class="[
            'input-group',
            this.size ? `input-group-${this.size}` : '',
            this.seamless ? 'input-group-seamless' : ''
        ]">
        <InputGroupAddon v-if="prependIsUsed" :prepend="Boolean(prepend || prependIsUsed)">
            <InputGroupText v-if="Boolean(prepend)" v-html="prepend"  />
            <slot name="prepend" />
        </InputGroupAddon>
        <slot />
        <InputGroupAddon v-if="appendIsUsed" :append="Boolean(append || appendIsUsed)">
            <InputGroupText v-if="Boolean(append)" v-html="append" />
            <slot name="append" />
        </InputGroupAddon>
    </component>
</template>

<script>
import InputGroupAddon from './InputGroupAddon.vue'
import InputGroupText from './InputGroupText.vue'

export default {
    name: 'd-input-group',
    components: {
        InputGroupAddon,
        InputGroupText
    },
    props: {
        /**
         * The element id.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The input group size.
         */
        size: {
            type: String,
            default: null,
            validator: v => ['sm', 'lg', null].includes(v)
        },
        /**
         * The prepend value.
         */
        prepend: {
            type: String,
            default: null
        },
        /**
         * The append value.
         */
        append: {
            type: String,
            default: null
        },
        /**
         * Whether it should be seamless, or not.
         */
        seamless: {
            type: Boolean,
            default: false
        },
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    },
    computed: {
        appendIsUsed() {
            return !!this.$slots['append'] || this.append
        },
        prependIsUsed() {
            return !!this.$slots['prepend'] || this.prepend
        }
    }
}
</script>

<style>
.input-group input:focus {
    position: relative;
    z-index: 3;
}

/* Adjust dropdowns inside input groups. */
.input-group > .input-group-prepend > .d-dropdown > .btn {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.input-group > .input-group-append > .d-dropdown > .btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

/* Datepickers */
.vdp-datepicker:not(:last-child) input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.vdp-datepicker:not(:first-child) input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.vdp-datepicker + .vdp-datepicker {
    margin-left: -1px;
}

.input-group-sm .vdp-datepicker input {
    height: 1.9375rem;
    font-size: 0.875rem;
    line-height: 1.5;
}
</style>
