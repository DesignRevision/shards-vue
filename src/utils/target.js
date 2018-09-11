const allListenTypes = {
    hover: true,
    click: true,
    focus: true
}

const BEL_KEY = '__DR_BOUND_EVENT_LISTENERS__'

const bindTargets = (vnode, binding, listenTypes, callback) => {
    const targets = Object.keys(binding.modifiers || {}).filter(t => !allListenTypes[t])

    if (binding.value) {
        targets.push(binding.value)
    }

    const listener = () => {
        callback({ targets, vnode })
    }

    Object.keys(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            vnode.elm.addEventListener(type, listener)
            const boundListeners = vnode.elm[BEL_KEY] || {}
            boundListeners[type] = boundListeners[type] || []
            boundListeners[type].push(listener)
            vnode.elm[BEL_KEY] = boundListeners
        }
    })

    return targets
}

const unbindTargets = (vnode, binding, listenTypes) => {
    Object.keys(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            const boundListeners = vnode.elm[BEL_KEY] && vnode.elm[BEL_KEY][type]
            if (boundListeners) {
                boundListeners.forEach(listener => vnode.elm.removeEventListener(type, listener))
                delete vnode.elm[BEL_KEY][type]
            }
        }
    })
}

export {
    bindTargets,
    unbindTargets
}

export default bindTargets
