<template>
    <button class="navbar-toggler"
        :aria-label="label"
        :aria-controls="target"
        :aria-expanded="toggleState ? 'true' : 'false'"
        @click="onClick">
        <slot>
            <span class="navbar-toggler-icon"></span>
        </slot>
    </button>
</template>

<script>
import rootListenerMixin from '../../mixins/root-listener.mixin'
import { COLLAPSE_EVENTS } from '../../utils/constants';

export default {
    name: 'd-navbar-toggle',
    mixins: [ rootListenerMixin ],
    data() {
        return {
            toggleState: false
        }
    },
    props: {
        /**
         * The label value.
         */
        label: {
            type: String,
            default: 'Toggle navigation'
        },
        /**
         * The toggle target.
         */
        target: {
            type: String,
            required: true
        }
    },
    methods: {
        onClick() {
            this.$root.$emit(COLLAPSE_EVENTS.TOGGLE, this.target)
        },
        handleStateEvent(id, state) {
            if (id === this.target) {
                this.toggleState = state
            }
        }
    },
    created() {
        this.listenOnRoot(COLLAPSE_EVENTS.STATE, this.handleStateEvent)
    }
}
</script>
