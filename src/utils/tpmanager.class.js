import Popper from 'popper.js'
import { CancelableEvent } from './events'
import { TP_STATE_CLASSES, TP_OFFSET_MAP, N_TP_PLACEMENTS, TOOLTIP_SELECTORS, TOOLTIP_HOVER_STATE_CLASSES, MODAL_EVENTS } from './constants'
import { getAttr, setAttr, removeAttr, guid, hasClass, addClass, removeClass, isDisabled, selectElement, isVisible, closest, getComputedStyles } from './index'

const Defaults = {
    animation: true,
    template: '',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    placement: 'top',
    offset: 0,
    arrowPadding: 6,
    container: false,
    fallbackPlacement: 'flip',
    callbacks: {},
    boundary: 'scrollParent'
}

const TransitionEndEvents = {
  WebkitTransition: ['webkitTransitionEnd'],
  MozTransition: ['transitionend'],
  OTransition: ['otransitionend', 'oTransitionEnd'],
  transition: ['transitionend']
}

const MODAL_CLASS = '.modal-content'

export default class TPManager {
    constructor(targetElement, config, $root) {
        this._config = null
        this._isEnabled = true
        this._fadeTimeout = null
        this._hoverTimeout = null
        this._visibleInterval = null
        this._hoverState = ''
        this._activeTrigger = {}
        this._popperInstance = null
        this._targetElement = targetElement
        this._TPElement = null
        this._id = guid()
        this._$root = $root || null
        this._routeWatcher = null

        this.updateConfig(config)
    }

    static get Defaults() {
        return Defaults
    }

    static getPlacement(placement) {
        return N_TP_PLACEMENTS[placement.toUpperCase()]
    }

    /*--------------------------------------------------------------------------
    /* PUBLIC
    /*--------------------------------------------------------------------------*/

    updateConfig(config) {
        let updatedConfig = { ...this.constructor.Defaults, ...config }

        if (config.delay && typeof config.delay === 'number') {
            updatedConfig.delay = {
                show: config.delay,
                hide: config.delay
            }
        }

        ['title', 'content'].forEach(part => {
            if (config[part] && typeof config[part] === 'number') {
                updatedConfig[part] = config[part].toString()
            }
        })

        this._config = updatedConfig

        this._updateTitleAttributes()
        this._removeEventListeners()
        this._addEventListeners()
    }

    show() {
        if (!document.body.contains(this._targetElement) || !isVisible(this._targetElement)) {
            return
        }

        const TPElement = this._getElement()
        this._updateTitleAttributes()
        this.setContent(TPElement)

        // Don't show if there's no content
        if (!this.hasContent(TPElement)) {
            this._TPElement = null
            return
        }

        // Set the ID on the TP element
        setAttr(TPElement, 'id', this._id)

        // Set the aria-describedby attribute on the target element
        let desc = getAttr(this._targetElement, 'aria-describedby') || ''
        desc = desc.split(/\s+/).concat(this._id).join(' ').trim()
        setAttr(this._targetElement, 'aria-describedby', desc)

        // Set animations
        if (this._config.animation) {
            addClass(TPElement, TP_STATE_CLASSES.FADE)
        } else {
            removeClass(TPElement, TP_STATE_CLASSES.FADE)
        }

        // Process placement
        let placement = this._config.placement

        if (typeof placement === 'function') {
            placement = placement.call(this, this._TPElement, this._targetElement)
        }

        const attachment = this.constructor.getPlacement(placement)
        this._addPlacementClass(attachment)

        // Emit and process a custom event
        const _showEvent = new CancelableEvent('show', {
            cancelable: true,
            target: this._targetElement,
            relatedTarget: TPElement
        })

        this._emitCustomEvent(_showEvent)

        if (_showEvent.defaultPrevented) {
            this._TPElement = null
            return
        }

        // Append the TP element to the container
        const container = this._getContainer()
        if (!document.body.contains(TPElement)) {
            container.appendChild(TPElement)
        }

        // Reinitialize Popper
        this._removePopper()
        this._popperInstance = new Popper(this._targetElement, TPElement, this._getPopperConfig(placement, TPElement))

        // Prep the transition complete handler
        const _transitionCompleteHandler = () => {
            if (this._config.animation) {
                const initConfigAnimation = this._config.animation || false

                if (getAttr(TPElement, 'x-placement') !== null) {
                    return
                }

                removeClass(TPElement, TP_STATE_CLASSES.FADE)
                this._config.animation = false
                this.hide()
                this.show()
                this._config.animation = initConfigAnimation
            }

            const prevHoverState = this._hoverState
            this._hoverState = null

            if (prevHoverState === TOOLTIP_HOVER_STATE_CLASSES.OUT) {
                this._handleLeave(null)
            }

            const shownEvt = new CancelableEvent('shown', {
                cancelable: false,
                target: this._targetElement,
                relatedTarget: TPElement
            })

            this._emitCustomEvent(shownEvt)
        }

        // Enable edge case listeners
        this._handleEdgeCases(true)
        addClass(TPElement, TP_STATE_CLASSES.SHOW)
        this._transitionOnce(TPElement, _transitionCompleteHandler)
    }

    hide(callbackFn, force) {
        const TPElement = this._TPElement

        if (!TPElement) {
            return
        }

        const hideEvent = new CancelableEvent('hide', {
            cancelable: !force,
            target: this._targetElement,
            relatedTarget: TPElement
        })

        this._emitCustomEvent(hideEvent)

        // Don't hide if the custom event is cancelled
        if (hideEvent.defaultPrevented) {
            return
        }

        // Disable edge case listeners
        this._handleEdgeCases(false)

        if (force) {
            removeClass(TPElement, TP_STATE_CLASSES.FADE)
        }

        removeClass(TPElement, TP_STATE_CLASSES.SHOW)

        // Update active trigger flags
        this._activeTrigger.click = false
        this._activeTrigger.focus = false
        this._activeTrigger.hover = false

        const _transitionCompleteHandler = () => {
            if (this._hoverState !== TOOLTIP_HOVER_STATE_CLASSES.SHOW && TPElement.parentNode) {
                TPElement.parentNode.removeChild(TPElement)

                // Remove the `aria-describedby` attribute
                let desc = getAttr(this._targetElement, 'aria-describedby') || ''
                desc = desc.split(/\s+/).filter(d => d !== this._id).join(' ').trim()
                desc ? setAttr(this._targetElement, 'aria-describedby', desc) : removeAttr(this._targetElement, 'aria-describedby')

                // Remove Popper and unset TPElement
                this._removePopper()
                this._TPElement = null
            }

            // Run the callback function if any.
            if (callbackFn) {
                callbackFn()
            }

            // Prep and emit custom event
            const _hiddenEvent = new CancelableEvent('hidden', {
                cancelable: false,
                target: this._targetElement,
                relatedTarget: null
            })

            this._emitCustomEvent(_hiddenEvent)
        }

        this._transitionOnce(TPElement, _transitionCompleteHandler)
        this._hoverState = ''
    }

    destroy() {
        this._removeEventListeners()
        this._handleEdgeCases(false)

        clearTimeout(this._hoverTimeout)
        clearTimeout(this._fadeTimeout)

        if (this._popperInstance) {
            this._popperInstance.destroy()
        }

        if (this._TPElement && this._TPElement.parentElement) {
            this._TPElement.parentElement.removeChild(this._TPElement)
        }

        this._hoverTimeout = null
        this._fadeTimeout = null
        this._popperInstance = null
        this._TPElement = null
        this._id = null
        this._$root = null
        this._isEnabled = true
        this._hoverState = null
        this._activeTrigger = null
        this._targetElement = null
    }

    setElementContent(container, content) {
        if (!container) {
            return
        }

        if (typeof content !== 'object' && !content.nodeType) {
            container[this._config.html ? 'innerHTML' : 'innerText'] = content
            return
        }

        if (this._config.html && content.parentElement !== container) {
            container.innerHTML = ''
            container.appendChild(content)
            return
        }

        container.innerText = content.innerText
    }

    getTitle() {
        let title = this._config.title || ''

        // Fallback to attributes or empty string
        if (!title) {
            title = getAttr(this._targetElement, 'title')
                        || getAttr(this._targetElement, 'data-original-title')
                        || ''
        }

        switch (typeof title) {
            case 'function':
                title = title(this._targetElement)
                break
            case 'object':
                if (title.nodeType && !title.innerHTML.trim()) {
                    title = ''
                }
                break
            case 'string':
                title = title.trim()
                break
        }

        return title
    }

    handleEvent(e) {
        if (isDisabled(this._targetElement) || !this._isEnabled) {
            return
        }

        switch (e.type) {
            case 'click':
                this._handleToggle(e)
                break
            case 'focusout':
                this._handleFocusOut(e)
                break
            case 'mouseleave':
                this._handleLeave(e)
                break
            case 'focusin':
            case 'mouseenter':
                this._handleEnter(e)
                break
        }
    }

    /*--------------------------------------------------------------------------
    /* PRIVATE
    /*--------------------------------------------------------------------------*/

    _addEventListeners() {
        const triggers = this._config.trigger.trim().split(/\s+/)
        const el = this._targetElement


        triggers.forEach(trigger => {
            switch (trigger) {
                case 'click':
                    el.addEventListener('click', this)
                    break
                case 'focus':
                    el.addEventListener('focusin', this)
                    el.addEventListener('focusout', this)
                    break
                case 'blur':
                    el.addEventListener('focusout', this)
                    break
                case 'hover':
                    el.addEventListener('mouseenter', this)
                    el.addEventListener('mouseleave', this)
            }
        }, this)
    }

    _removeEventListeners() {
        ['click', 'focusin', 'focusout', 'mouseenter', 'mouseleave']
            .forEach(e => this._targetElement.removeEventListener(e, this), this)
    }

    _handleFocusOut(e) {
        // Don't trigger if the focus moves from trigger to TP element
        if (
            this._TPElement
            && this._targetElement
            && this._targetElement.contains(e.target)
            && this._TPElement.contains(e.relatedTarget)
        ) {
            return
        }

        // Don't trigger if the focus moves from TP element to trigger
        if (
            this._TPElement
            && this._targetElement
            && this._TPElement.contains(e.target)
            && this._targetElement.contains(e.relatedTarget)
        ) {
            return
        }

        // Don't trigger if the focus moves within the element
        if (
            this._TPElement
            && this._TPElement.contains(e.target)
            && this._TPElement.contains(e.relatedTarget)
        ) {
            return
        }

        this._handleLeave(e)
    }

    _getElement() {
        let tpl = this._config.template;
        tpl = (!tpl || typeof tpl !== 'string') ? this.constructor.Defaults.template : this._config.template

        if (!this._TPElement) {
            let div = document.createElement('div')
            div.innerHTML = tpl.trim()
            this._TPElement = div.firstElementChild ? div.removeChild(div.firstElementChild) : null
            div = null
        }

        this._TPElement.tabIndex = -1

        return this._TPElement
    }

    _forceHide() {
        if (!this._TPElement || !hasClass(this._TPElement, TP_STATE_CLASSES.SHOW)) {
            return
        }

        this._handleEdgeCases(false)
        clearTimeout(this._hoverTimeout)
        this._hoverTimeout = null
        this._hoverState = ''
        this.hide(null, true)
    }

    _handleToggle(event) {
        if (!this._isEnabled) {
            return
        }

        if (event) {
            this._activeTrigger.click = !this._activeTrigger.click
            this._hasActiveTrigger() ? this._handleEnter(null) : this._handleLeave(null)
            return
        }

        hasClass(this._getElement(), TP_STATE_CLASSES.SHOW) ? this._handleLeave(null) : this._handleEnter(null)
    }

    _handleLeave(e) {
        if (e) {
            const trigger = e.type === 'focusout' ? 'focus' : 'hover'
            this._activeTrigger[trigger] = false

            if (e.type === 'focusout' && /blur/.test(this._config.trigger)) {
                this._activeTrigger.click = false
                this._activeTrigger.hover = false
            }
        }

        if (this._hasActiveTrigger()) {
            return
        }

        clearTimeout(this._hoverTimeout)

        this._hoverState = TOOLTIP_HOVER_STATE_CLASSES.OUT

        if (!this._config.delay || !this._config.delay.hide) {
            this.hide()
            return
        }

        this._hoverTimeout = setTimeout(() => {
            if (this._hoverState === TOOLTIP_HOVER_STATE_CLASSES.OUT) {
                this.hide()
            }
        }, this._config.delay.hide)
    }


    _hasActiveTrigger() {
        for (const trigger in this._activeTrigger) {
            if (this._activeTrigger[trigger]) {
                return true
            }
        }

        return false
    }

    _updateTitleAttributes() {
        const el = this._targetElement
        const titleType = typeof getAttr(el, 'data-original-title')
        if (getAttr(el, 'title') || titleType !== 'string') {
            setAttr(el, 'data-original-title', getAttr(el, 'title') || '')
            setAttr(el, 'title', '')
        }
    }

    _handleEnter(e) {
        if (e) {
            const trigger = e.type === 'focusin' ? focus : 'hover'
            this._activeTrigger[trigger] = true
        }

        if (hasClass(this._getElement(), TP_STATE_CLASSES.SHOW) || this._hoverState === TP_STATE_CLASSES.SHOW) {
            this._hoverState = TP_STATE_CLASSES.SHOW
            return
        }

        clearTimeout(this._hoverTimeout)
        this._hoverState = TP_STATE_CLASSES.SHOW

        if (!this._config.delay || !this._config.delay.show) {
            this.show()
            return
        }

        this._hoverTimeout = setTimeout(() => {
            if (this._hoverState === TP_STATE_CLASSES.SHOW) {
                this.show()
            }
        }, this._config.delay.show)
    }

    _handleEdgeCases(on) {
        if (this._TPElement === null) {
            return
        }

        this._setModalListener(on)
        this._visibleCheck(on)
        this._setRouteWatcher(on)
        this._setOnTouchStartListener(on)

        if (on && /(focus|blur)/.test(this._config.trigger)) {
            this._TPElement.addEventListener('focusout', this)
        } else {
            this._TPElement.removeEventListener('focusout', this)
        }
    }

    _setModalListener (on) {
        const modal = closest(MODAL_CLASS, this._targetElement)

        if (!modal) {
            return
        }

        if (this._$root) {
            this._$root[on ? '$on' : '$off'](MODAL_EVENTS.HIDDEN, this._forceHide.bind(this))
        }
    }

    _visibleCheck(on) {
        clearInterval(this._visibleInterval)
        this._visibleInterval = null

        if (!on) {
            return
        }

        this._visibleInterval = setInterval(() => {
            const tip = this._getElement()
            if (tip && !isVisible(this._targetElement) && hasClass(tip, TP_STATE_CLASSES.SHOW)) {
                this._forceHide()
            }
        }, 100)
    }

    _setRouteWatcher(on) {
        if (on) {
            this._setRouteWatcher(false)
            if (this._$root && Boolean(this._$root.route)) {
                this._routeWatcher = this._$root.$watch('$route', (newVal, oldVal) => {
                    if (newVal === oldVal) {
                        return
                    }

                    this._forceHide()
                })
            }
        } else {
            if (this._routeWatcher) {
                this._routeWatcher()
                this._routeWatcher = null
            }
        }
    }

    _setOnTouchStartListener(on) {
        if (!('ontouchstart' in document.documentElement)) {
            return
        }

        Array.from(document.body.children).forEach(el => {
            if (on) {
                el.addEventListener('mouseover', () => {})
            } else {
                el.removeEventListener('mouseover', () => {})
            }
        })
    }

    _getPopperConfig(placement, tip) {
        return {
            placement: this.constructor.getPlacement(placement),
            modifiers: {
                offset: { offset: this._getOffset(placement, tip) },
                flip: { behavior: this._config.fallbackPlacement },
                arrow: { element: '.arrow' },
                preventOverflow: { boundariesElement: this._config.boundary }
            },
            onCreate: data => {
                if (data.originalPlacement !== data.placement) {
                    this._handlePopperPlacementChange(data)
                }
            },
            onUpdate: data => {
                this._handlePopperPlacementChange(data)
            }
        }
    }

    _getOffset(placement, tip) {
        if (this._config.offset) {
            return this._config.offset
        }

        const arrow = selectElement(TOOLTIP_SELECTORS.ARROW, tip)
        const arrowOffset = parseFloat(getComputedStyles(arrow).width) + parseFloat(this._config.arrowPadding)
        switch (TP_OFFSET_MAP[placement.toUpperCase()]) {
            case +1:
                return `+50%p - ${arrowOffset}px`
            case -1:
                return `-50%p + ${arrowOffset}px`
            default:
                return 0
        }
    }

    _handlePopperPlacementChange(data) {
        const TPElement = this._getElement()
        const tabClass = TPElement.className.match(new RegExp(`\\b${this.constructor.ClassPrefix}\\S+`, 'g'))

        if (tabClass === null && !tabClass.length) {
            return
        }

        tabClass.forEach(className => removeClass(TPElement, className))
        this._addPlacementClass(this.constructor.getPlacement(data.placement))
    }

    _removePopper() {
        if (this._popperInstance) {
            this._popperInstance.destroy()
        }

        this._popperInstance = null
    }

    _getContainer() {
        const container = this._config.container
        const body = document.body
        return container === false ? (closest(MODAL_CLASS, this._targetElement) || body) : (selectElement(container, body) || body)
    }

    _emitCustomEvent(event) {
        const eventName = event.type

        if (this._$root && this._$root.$emit) {
            this._$root.$emit(`dr:${this.constructor.Name}:${eventName}`, event)
        }

        const callbacks = this._config.callbacks || {}

        if (typeof callbacks[eventName] === 'function') {
            callbacks[eventName]()
        }
    }

    _transitionOnce(TPElement, completeHandlerFn) {
        const transEvents = this._getTransitionEndEvents()
        let called = false
        clearTimeout(this._fadeTimeout)
        this._fadeTimeout = null

        const fnOnce = () => {
            if (called) {
                return
            }

            called = true
            clearTimeout(this._fadeTimeout)
            this._fadeTimeout = null
            transEvents.forEach(eventName => TPElement.removeEventListener(eventName, fnOnce))
            completeHandlerFn()
        }

        if (hasClass(TPElement, TP_STATE_CLASSES.FADE)) {
            transEvents.forEach(eventName => TPElement.addEventListener(eventName, fnOnce))
            this._fadeTimeout = setTimeout(fnOnce, 150)
        } else {
            fnOnce()
        }
    }

    _getTransitionEndEvents() {
        for (const name in TransitionEndEvents) {
            if (this._targetElement.style[name] !== undefined) {
                return TransitionEndEvents[name]
            }
        }

        return []
    }

    _addPlacementClass(placement) {
        const Popover = this._getElement()
        addClass(Popover, `${this.constructor.ClassPrefix}-${placement}`)
    }
}
