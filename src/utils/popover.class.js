import TPManager from './tpmanager.class'
import { selectElement, removeClasses } from './index'
import { POPOVER_SELECTORS, TP_STATE_CLASSES } from './constants'

const PopoverDefaults = {
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
}

const Defaults = { ...TPManager.Defaults, ...PopoverDefaults }

export default class Popover extends TPManager {

    static get Name () {
        return 'popover'
    }

    static get Defaults () {
        return Defaults
    }

    static get ClassPrefix () {
        return 'bs-popover'
    }

    /*--------------------------------------------------------------------------
    /* OVERRIDES
    /*--------------------------------------------------------------------------*/

    /**
     * Checks if the Popover has content.
     * @returns True if the Popover has content (title or body), false otherwise.
     */
    hasContent(TPElement) {
        const Popover = TPElement || this._TPElement

        if (!Popover) {
            return false
        }

        const popoverHeaderEl = selectElement(POPOVER_SELECTORS.HEADER, Popover)
        const popoverBodyEl = selectElement(POPOVER_SELECTORS.BODY, Popover)
        const hasHeader = Boolean((popoverHeaderEl || {}).innerHTML)
        const hasBody = Boolean((popoverBodyEl || {}).innerHTML)

        return hasHeader || hasBody
    }

    /**
     * Sets the content for the Popover element.
     */
    setContent(TPElement) {
        const Popover = TPElement || this._TPElement

        const popoverHeaderEl = selectElement(POPOVER_SELECTORS.HEADER, Popover)
        const popoverBodyEl = selectElement(POPOVER_SELECTORS.BODY, Popover)

        this.setElementContent( popoverHeaderEl, this.getTitle())
        this.setElementContent( popoverBodyEl, this.getContent())

        removeClasses(Popover, [TP_STATE_CLASSES.FADE, TP_STATE_CLASSES.SHOW])
    }

    /*--------------------------------------------------------------------------
    /* CLASS SPECIFIC
    /*--------------------------------------------------------------------------*/

    /**
     * Returns the Popover content.
     */
    getContent() {
        let content = this._config.content || ''

        switch (content) {
            case 'string':
                content = content.trim()
                break
            case 'function':
                content = content(this._targetElement)
                break
            case 'object':
                if (content.nodeType && !content.innerHTML.trim()) {
                    content = ''
                }
                break
        }

        return content
    }
}
