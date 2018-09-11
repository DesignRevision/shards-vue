
import TPManager from './tpmanager.class'
import { TP_STATE_CLASSES, TOOLTIP_SELECTORS } from './constants'
import { removeClasses, selectElement } from './index'

const TooltipDefaults = {
    template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
}

const Defaults = { ...TPManager.Defaults, ...TooltipDefaults }

export default class Tooltip extends TPManager {

    static get Name() {
        return 'tooltip'
    }

    static get Defaults() {
        return Defaults
    }

    static get ClassPrefix() {
        return 'bs-tooltip'
    }

    /*--------------------------------------------------------------------------
    /* OVERRIDES
    /*--------------------------------------------------------------------------*/

    /**
     * Checks whether the Tooltip has any content.
     */
    hasContent(TPElement) {
        const Tooltip = TPElement || this._TPElement

        if (!Tooltip) {
            return false
        }

        const tooltipInnerEl = selectElement(TOOLTIP_SELECTORS.TOOLTIP_INNER, Tooltip)

        return Boolean((tooltipInnerEl || {}).innerHTML)
    }

    /**
     * Sets the Tooltip content.
     */
    setContent(TPElement) {
        const Tooltip = TPElement || this._TPElement

        if (!Tooltip) {
            return false
        }

        const tooltipInnerEl = selectElement(TOOLTIP_SELECTORS.TOOLTIP_INNER, Tooltip)
        this.setElementContent(tooltipInnerEl, this.getTitle())

        removeClasses(Tooltip, [TP_STATE_CLASSES.FADE, TP_STATE_CLASSES.SHOW])
    }
}
