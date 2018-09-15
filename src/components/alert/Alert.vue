<template>
    <div v-if="computedShow"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        :class="[
            'alert',
            theme ? `alert-${theme}` : '',
            dismissible ? `alert-dismissible` : ''
        ]">
        <slot />
        <d-button-close v-if="dismissible"
            :aria-label="dismissLabel"
            @click="dismiss"
            href="#" />
    </div>
</template>

<script>
import { THEMECOLORS, ALERT_EVENTS } from '../../utils/constants';
import dButtonClose from '../button/ButtonClose.vue';

export default {
    name: 'd-alert',
    components: {
        dButtonClose
    },
    props: {
        /**
         * Alert color theme.
         */
        theme: {
            type: String,
            default: 'primary',
            validator: v => THEMECOLORS.includes(v)
        },
        /**
         * Whether the alert is dismissible, or not.
         */
        dismissible: {
            type: Boolean,
            default: false
        },
        /**
         * Dismiss button label.
         */
        dismissLabel: {
            type: String,
            default: 'Close'
        },
        /**
         * Show state or duration.
         */
        show: {
            type: [Boolean, Number, String],
            default: false
        }
    },
    model: {
        prop: 'show',
        event: 'input'
    },
    data() {
        return {
            timer: null,
            dismissed: false
        }
    },
    watch: {
        show() {
            this.showChanged();
        }
    },
    mounted() {
        this.showChanged();
    },
    destroyed() {
        this.clearCounter();
    },
    computed: {
        computedShow() {
            return !this.dismissed && (this.timer || this.show);
        }
    },
    methods: {
        clearCounter() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },

        dismiss() {
            this.clearCounter();
            this.dismissed = true;

            /**
             * Alert dismissed event.
             *
             * @event alert-dismissed
             * @type {Boolean}
             */
            this.$emit(ALERT_EVENTS.DISMISSED);
            this.$emit('input', false);

            if (typeof this.show === 'boolean') {
                this.$emit('input', false);
                return;
            }

            /**
             * Alert dismiss countdown event.
             *
             * @event alert-dismiss-countdown
             * @type {Number}
             */
            this.$emit(ALERT_EVENTS.DISMISS_COUNTDOWN, 0);
            this.$emit('input', 0);
        },

        showChanged() {
            this.clearCounter();
            this.dismissed = false;

            if (typeof this.show === 'boolean' || this.show === null || this.show === 0)
                return

            let dismissTimer = this.show;
            this.timer = setInterval(() => {
                if (dismissTimer < 1) {
                    this.dismiss();
                    return;
                }

                dismissTimer--;

                /**
                 * Alert dismiss countdown event.
                 *
                 * @event alert-dismiss-countdown
                 * @type {Number}
                 */
                this.$emit(ALERT_EVENTS.DISMISS_COUNTDOWN, dismissTimer);
                this.$emit('input', dismissTimer);
            }, 1000);
        }
    }
}
</script>

<style scoped>
.close {
    min-height: 100%;
    padding: 0.625rem 1.25rem 0.75rem 1.25rem;
}
</style>
