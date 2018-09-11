<template>
  <transition name="fade">
    <component :is="tag"
        :class="[
            'modal',
            this.noBackdrop ? 'modal--no-backdrop' : ''
        ]">
      <div :class="[
            'modal-dialog',
            size ? `modal-${size}` : '',
            centered ? `modal-dialog-centered` : '',
        ]"
        role="document"
        v-on-clickaway="away">
        <div class="modal-content">
            <slot />
        </div>
      </div>
    </component>
  </transition>
</template>

<script>
import { mixin as clickAwayMixin } from 'vue-clickaway';
import { MODAL_EVENTS } from '../../utils/constants';

export default {
    name: 'd-modal',
    mixins: [clickAwayMixin],
    props: {
        /**
         * The component tag.
         */
        tag: {
            type: String,
            default: "div"
        },
        /**
         * The size (sm, lg).
         */
        size: {
            type: String,
            default: null,
            validator: v => ['sm', 'lg'].includes(v)
        },
        /**
         * Hides the backdrop overlay.
         */
        noBackdrop: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it is centered, or not.
         */
        centered: {
            type: Boolean,
            default: false
        }
    },
  methods: {
    away() {
        if (this.noBackdrop) {
            return;
        }

        /**
         * @event close
         *
         * Triggered when the modal is closed.
         */
        this.$emit('close');

        /**
         * @event hidden
         *
         * Triggered when the modal is hidden.
         */
        this.$root.$emit(MODAL_EVENTS.HIDDEN)
    }
  },
};
</script>

<style scoped>
.modal {
    display: block;
    background-color: rgba(0,0,0,0.5);
    transition: .3s;
    overflow-y: auto;
}

.modal-dialog {
    transition: .3s;
}

.modal--no-backdrop {
    background: none;
    pointer-events: none;
}

.fade-enter {
    transform: translate(0,0);
    opacity: 1;
}

.fade-leave-active {
    transform: translate(0,0);
    opacity: 1;
}

.fade-enter, .fade-leave-active {
    opacity: 0;
}

.fade-enter .modal-dialog,
.fade-leave-active .modal-dialog {
    -webkit-transform: translate(0,-25%);
    transform: translate(0,-25%);
}
</style>
