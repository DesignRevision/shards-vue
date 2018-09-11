import Tooltip from '../../utils/tooltip.class'

const inBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
const KEY = '_DR_TOOLTIP_'
const validTriggers = {
    'focus': true,
    'hover': true,
    'click': true,
    'blur': true
}

/**
 * Bindings parser.
 */
function parseBindings(bindings) {
    let config = {}

    switch (typeof bindings.value) {
        case 'string':
        case 'function':
            config.title = bindings.value
            break
        case 'object':
            config = { ...bindings.value }
    }

    // Parse args (eg: v-d-tooltip:my-container)
    if (bindings.arg) {
        config.container = `#${bindings.arg}` // #my-container
    }

    // Parse modifiers. eg: v-d-tooltip.my-modifier
    Object.keys(bindings.modifiers).forEach(mod => {
        // Parse if the title allows HTML
        if (/^html$/.test(mod)) {
            config.html = true

        // Parse animation
        } else if (/^nofade$/.test(mod)) {
            config.animation = false

        // Parse placement
        } else if (/^(auto|top(left|right)?|bottom(left|right)?|left(top|bottom)?|right(top|bottom)?)$/.test(mod)) {
            config.placement = mod

        // Parse boundary
        } else if (/^(window|viewport)$/.test(mod)) {
            config.boundary = mod

        // Parse delay
        } else if (/^d\d+$/.test(mod)) {
            const delay = parseInt(mod.slice(1), 10) || 0
            if (delay) {
                config.delay = delay
            }

        // Parse offset
        }  else if (/^o-?\d+$/.test(mod)) {
            const offset = parseInt(mod.slice(1), 10) || 0
            if (offset) {
                config.offset = offset
            }
        }
    })

    // Parse selected triggers.
    const selectedTriggers = {}
    let triggers = typeof config.trigger === 'string' ? config.trigger.trim().split(/\s+/) : []

    triggers.forEach(trigger => {
        if (validTriggers[trigger]) {
            selectedTriggers[trigger] = true
        }
    })

    // Parse trigger modifiers. eg: v-d-tooltip.click
    Object.keys(validTriggers).forEach(trigger => {
        if (bindings.modifiers[trigger]) {
            selectedTriggers[trigger] = true
        }
    })

    config.trigger = Object.keys(selectedTriggers).join(' ')

    // Convert `blur` to `focus`
    if (config.trigger === 'blur') {
        config.trigger = 'focus'
    }

    // If there's no trigger assigned, just delete the key.
    if (!config.trigger) {
        delete config.trigger
    }

    return config
}

function applyTooltip(el, bindings, vnode) {
    if (!inBrowser) {
        return
    }

    const parsedBindings = parseBindings(bindings)

    if (!el[KEY]) {
        el[KEY] = new Tooltip(el, parsedBindings, vnode.context.$root)
        return
    }

    el[KEY].updateConfig(parsedBindings)
}

export default {
    bind (el, bindings, vnode) {
        applyTooltip(el, bindings, vnode)
    },

    inserted(el, bindings, vnode) {
        applyTooltip(el, bindings, vnode)
    },

    update (el, bindings, vnode) {
        if (bindings.value !== bindings.oldValue) {
            applyTooltip(el, bindings, vnode)
        }
    },

    componentUpdated (el, bindings, vnode) {
        if (bindings.value !== bindings.oldValue) {
            applyTooltip(el, bindings, vnode)
        }
    },

    unbind (el) {
        if (!inBrowser) {
            return
        }

        if (el[KEY]) {
            el[KEY].destroy()
            el[KEY] = null
            delete el[KEY]
        }
    }
}
