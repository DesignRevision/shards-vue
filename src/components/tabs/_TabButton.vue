<template>
    <li :class="['nav-item', itemClass]" role="presentation">
        <a :class="[
            'nav-link',
            active ? 'active' : '',
            disabled ? 'disabled' : '',
            linkClass
        ]"
        role="tab"
        tabindex="-1"
        :id="computedID"
        :disabled="disabled"
        :aria-selected="active ? 'true' : 'false'"
        :aria-setsize="setSize"
        :aria-posinset="posInSet"
        :aria-controls="controls"
        v-html="content"
        @click="handleClick"
        @keydown="handleClick" />
    </li>
</template>

<script>
import { guid } from '../../utils'
import { KEYCODES } from '../../utils/constants';

export default {
    name: 'd-tab-button',
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The active state.
         */
        active: {
            type: Boolean,
            default: false
        },
        /**
         * The disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The link class.
         */
        linkClass: {
            type: String,
            default: null
        },
        /**
         * The item class.
         */
        itemClass: {
            type: String,
            default: null
        },
        /**
         * The aria-setsize value.
         */
        setSize: {
            type: Number,
            default: 0,
        },
        /**
         * The position in set value (aria-posinset).
         */
        posInSet: {
            type: Number,
            default: 0,
        },
        /**
         * The aria-controls value.
         */
        controls: {
            type: String,
            default: null
        },
        /**
         * The content.
         */
        content: {
            type: String,
            default: null
        }
    },
    methods: {
        handleClick(e) {
            if (this.disabled) {
                e.preventDefault()
                e.stopPropagation()
            }

            if (e.type === 'click'
                || e.keyCode === KEYCODES.ENTER
                || e.keyCode === KEYCODES.SPACE) {
                e.preventDefault()
                e.stopPropagation()
                this.$emit('click', e)
            }
        }
    },
    computed: {
        computedID() {
            return this.id || `d-tab-btn-${guid()}`
        }
    }
}
</script>

<style scoped>
.nav-link.active {
    border-bottom: 1px solid transparent;
}

.nav-link:hover {
    cursor: pointer;
}

.nav-link.disabled:hover {
    cursor: not-allowed;
}
</style>
