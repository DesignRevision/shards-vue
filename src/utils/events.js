// Creates the cancelable event props.
function _makeCancelableEventProps() {
    return { enumerable: true, configurable: false, writable: false }
}

/**
 * Custom cancelable event.
 */
export class CancelableEvent {
    constructor (type, eventInit = {}) {
        Object.assign(this, CancelableEvent.defaults(), eventInit, { type })

        Object.defineProperties(this, {
            type: _makeCancelableEventProps(),
            cancelable: _makeCancelableEventProps(),
            nativeEvent: _makeCancelableEventProps(),
            target: _makeCancelableEventProps(),
            relatedTarget: _makeCancelableEventProps(),
            vueTarget: _makeCancelableEventProps()
        })

        let defaultPrevented = false

        this.preventDefault = function preventDefault() {
            if (this.cancelable) {
                defaultPrevented = true
            }
        }

        Object.defineProperty(this, 'defaultPrevented', {
            enumerable: true,
            get() {
                return defaultPrevented
            }
        })
    }

    static defaults() {
        return {
            type: '',
            cancelable: true,
            nativeEvent: null,
            target: null,
            relatedTarget: null,
            vueTarget: null
        }
    }
}
