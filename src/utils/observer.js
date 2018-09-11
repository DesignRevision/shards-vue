import { isElement } from './'

/**
 * Observes DOM changes.
 * @see http://stackoverflow.com/questions/3219758
 */
export default (el, callback, opts = null) => {

    if (opts === null) {
        opts = {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        }
    }

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    const eventListenerSupported = window.addEventListener

    el = el ? (el.$el || el) : null
    if (!isElement(el)) {
        return null
    }

    let obs = null

    if (MutationObserver) {
        obs = new MutationObserver(mutations => {
            let changed = false
            for (let i = 0; i < mutations.length && !changed; i++) {
                const mutation = mutations[i]
                const type = mutation.type
                const target = mutation.target
                if (type === 'characterData' && target.nodeType === Node.TEXT_NODE) {
                    changed = true
                } else if (type === 'attributes') {
                    changed = true
                } else if (type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    changed = true
                }
            }
            if (changed) {
                callback()
            }
        })

        obs.observe(el, { ...{ childList: true, subtree: true }, ...opts })
    } else if (eventListenerSupported) {
        el.addEventListener('DOMNodeInserted', callback, false)
        el.addEventListener('DOMNodeRemoved', callback, false)
    }

    return obs
}
