export default function createLinkProps() {
    return {
        href: {
            type: String,
            default: null
        },
        to: {
            type: [String, Object],
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        },
        target: {
            type: String,
            default: '_self'
        },
        rel: {
            type: String,
            default: null
        },
        exact: {
            type: Boolean,
            default: false
        },
        exactActiveClass: {
            type: String
        },
        active: {
            type: Boolean,
            default: false
        },
        activeClass: {
            type: String
        },
        tag: {
            type: String,
            default: 'a'
        },
        routerTag: {
            type: String,
            default: 'a'
        },
        event: {
            type: [String, Array],
            default: 'click'
        },
        append: {
            type: Boolean,
            default: false
        }
    }
}
