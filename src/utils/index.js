/*--------------------------------------------------------------------------
/* UTILITY FUNCTIONS
/*--------------------------------------------------------------------------*/

// Install a Vue plugin if Vue is available on the window object.
export function vueUse(VuePlugin) {
    if (typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(VuePlugin)
    }
}

// Register a component plugin.
export function registerComponent(Vue, name, definition) {
    Vue._shards_vue_components_ = Vue._shards_vue_components_ || {}
    const loaded = Vue._shards_vue_components_[name]

    if (!loaded && definition && name) {
        Vue._shards_vue_components_[name] = true
        Vue.component(name, definition)
    }

    return loaded
}

// Register a group of components.
export function registerComponents(Vue, components) {
    for (let component in components) {
        registerComponent(Vue, component, components[component])
    }
}

// Register a directive as being loaded. returns true if directive plugin already registered
export function registerDirective(Vue, name, definition) {
    Vue._shards_vue_directives_ = Vue._shards_vue_directives_ || {}
    const loaded = Vue._shards_vue_directives_[name]

    if (!loaded && definition && name) {
        Vue._shards_vue_directives_[name] = true
        Vue.directive(name, definition)
    }

    return loaded
}

// Register a group of directives as being loaded.
export function registerDirectives(Vue, directives) {
    for (let directive in directives) {
        registerDirective(Vue, directive, directives[directive])
    }
}

// Array check
if (!Array.isArray) {
    Array.isArray = arg => Object.prototype.toString.call(arg) === '[object Array]'
}
export const isArray = Array.isArray;

// Element.matches polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            // eslint-disable-next-line
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}

// Converts a value to an array.
export function convertToArray(value) {
    if (typeof value === 'string') {
        value = value.split(' ')
    }
    return value
}

// Mocks SVGAnimatedString
let SVGAnimatedString = function () {}
if (typeof window !== 'undefined') {
    SVGAnimatedString = window.SVGAnimatedString
}

// Generates a GUID
export const guid = () => {
    var lut = [];

    for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }

    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;

    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}


/*--------------------------------------------------------------------------
/* DOM UTILITY FUNCTIONS
/*--------------------------------------------------------------------------*/

// Get an element by id
export const getById = (id) => {
    return document.getElementById(/^#/.test(id) ? id.slice(1) : id) || null
}

// Checks whether a variable is a DOM element, or not.
export const isElement = el => {
    return el && el.nodeType === Node.ELEMENT_NODE
}

// Checks whether an element has a particular class name, or not.
export const hasClass = (el, className) => {
    if (className && isElement(el)) {
        return el.classList.contains(className)
    }

    return false
}

// Adds a class to an element
export const addClass = (el, className) => {
    if (className && isElement(el)) {
        el.classList.add(className)
    }
}

// Removes a class from an element
export const removeClass = (el, className) => {
    if (className && isElement(el)) {
        el.classList.remove(className)
    }
}

// Removes multiple classes
export function removeClasses(el, classes) {
    const newClasses = convertToArray(classes)
    let classList

    if (el.className instanceof SVGAnimatedString) {
        classList = convertToArray(el.className.baseVal)
    } else {
        classList = convertToArray(el.className)
    }

    newClasses.forEach((newClass) => {
        const index = classList.indexOf(newClass)
        if (index !== -1) {
            classList.splice(index, 1)
        }
    })

    if (el instanceof SVGElement) {
        el.setAttribute('class', classList.join(' '))
    } else {
        el.className = classList.join(' ')
    }
}

// Sets an attribute on an element
export const setAttr = (el, attr, value) => {
    if (attr && isElement(el)) {
        el.setAttribute(attr, value)
    }
}

// Removes an attribute from an element
export const removeAttr = (el, attr) => {
    if (attr && isElement(el)) {
        el.removeAttribute(attr)
    }
}

// Gets an attribute value from an element
export const getAttr = (el, attr) => {
    if (attr && isElement(el)) {
        return el.getAttribute(attr)
    }

    return null
}

// Checks whether an element is disabled, or not.
export const isDisabled = el => {
    return !isElement(el)
        || el.disabled
        || el.classList.contains('disabled')
        || Boolean(el.getAttribute('disabled'))
}

// Determines if an HTML element is visible - Faster than CSS check
export const isVisible = el => {
    return isElement(el)
        && document.body.contains(el)
        && el.getBoundingClientRect().height > 0
        && el.getBoundingClientRect().width > 0
}

// Selects an element.
export const selectElement = (selector, root) => {
    if (!isElement(root)) {
        root = document
    }

    return root.querySelector(selector) || null
}

// Finds closest element matching selector.
export const closest = (selector, root) => {
    if (!isElement(root)) {
        return null
    }

    const Closest = Element.prototype.closest ||
        function (sel) {
            let element = this
            if (!document.documentElement.contains(element)) {
                return null
            }

            do {
                if (element.matches(sel)) {
                    return element
                }

                element = element.parentElement
            } while (element !== null)

            return null
        }

    const el = Closest.call(root, selector)

    return el === root ? null : el
}

export const getComputedStyles = el => {
    return isElement(el) ? window.getComputedStyle(el) : {}
}
