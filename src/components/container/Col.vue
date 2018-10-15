<template>
    <component :is="tag"
        :class="[
            breakpointClasses,
            (col || (breakpointClasses.length === 0 && !cols)) ? 'col' : '',
            cols ? `col-${cols}` : '',
            offset ? `offset-${offset}` : '',
            order ? `order-${order}` : '',
            alignSelf ? `align-self-${alignSelf}` : ''
        ]">
        <slot />
    </component>
</template>

<script>
export const suffixPropName = (suffix, str) => str + (suffix ? upperFirst(suffix) : '')
export const upperFirst = (str) => String(str).charAt(0).toUpperCase() + String(str).slice(1)

// Creates Bootstrap specific breakpoint classes.
export const createBreakpointClass = (type, breakpoint, val) => {
    if (!!val === false) {
        return false
    }

    let className = type

    if (breakpoint) {
        className += `-${breakpoint.replace(type, '')}` // -md ?
    }

    if (type === 'col' && (val === '' || val === true)) {
        return className.toLowerCase() // .col-md
    }

    return `${className}-${val}`.toLowerCase()
}

// Generates component properties.
export function generateProp(type = [Boolean, String, Number], defaultVal = null) {
    return {
        default: defaultVal,
        type
    }
}

// Breakpoints for later use.
const BREAKPOINTS = ['sm', 'md', 'lg', 'xl']

// Generate breakpoint maps.
const breakpointCol = createBreakpointMap([String, Number, Boolean], false)
const breakpointOffset = createBreakpointMap([String, Number], null, suffixPropName, 'offset')
const breakpointOrder = createBreakpointMap([String, Number], null, suffixPropName, 'order')

// Creates breakpoint maps
function createBreakpointMap(propGenArgs = null, defaultValue, breakpointWrapper = null, ...breakpointWrapperArgs) {
    breakpointWrapper = breakpointWrapper === null ? (v) => v : breakpointWrapper
    return BREAKPOINTS.reduce(function (map, breakpoint) {
        map[breakpointWrapper(breakpoint, ...breakpointWrapperArgs)] = generateProp(propGenArgs, defaultValue)
        return map
    }, {})
}

// Define breakpoint props map
const breakpointPropMap = Object.assign({}, {
    col: Object.keys(breakpointCol),
    offset: Object.keys(breakpointOffset),
    order: Object.keys(breakpointOrder)
})

export default {
    name: 'd-col',
    props: Object.assign({},
        breakpointCol,
        breakpointOffset,
        breakpointOrder, {
            /**
             * The col element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Automatic column.
             */
            col: {
                type: Boolean,
                default: false
            },
            /**
             * Make the component span a certain no. of columns.
             */
            cols: generateProp([String, Number]),
            /**
             * Offset certain no. of columns.
             */
            offset: generateProp([String, Number]),
            order: generateProp([String, Number]),
            alignSelf: {
                type: String,
                default: null,
                validator: v => ['auto', 'start', 'end', 'center', 'baseline', 'stretch'].includes(v)
            }
        }),
    computed: {
        breakpointClasses() {
            const classList = []
            for (const type in breakpointPropMap) {
                const keys = breakpointPropMap[type]
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i]
                    const breakpointClass = createBreakpointClass(type, key, this[key])

                    if (breakpointClass && classList.indexOf(breakpointClass) === -1) {
                        classList.push(breakpointClass)
                    }
                }
            }

            return classList
        }
    }
}
</script>

