<template>
    <component :is="computedTag"
        :class="[
            'list-group-item',
            theme ? `list-group-item-${theme}` : '',
            isAction ? 'list-group-item-action': '',
            active ? 'active' : '',
            disabled ? 'disabled' : ''
        ]"
        :disabled="button && disabled">
        <slot />
    </component>
</template>

<script>
import dLink from '../link/Link.vue'
import createLinkProps from '../link/create-link-props'
import { THEMECOLORS } from '../../utils/constants'

let _linkProps = createLinkProps()

if (_linkProps && typeof _linkProps.href !== 'undefined') {
    delete _linkProps.href.default
}

if (_linkProps && typeof _linkProps.to !== 'undefined') {
    delete _linkProps.to.default
}

const _actionTags = ['a', 'router-link', 'button', 'd-link']

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
export default {
    name: 'd-list-group-item',
    components: {
        dLink
    },
    props: {
        ..._linkProps, ...{
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * The element action.
             */
            action: {
                type: Boolean,
                default: null
            },
            /**
             * Whether the element tag should be a button, or not.
             */
            button: {
                type: Boolean,
                default: null
            },
            /**
             * The theme color.
             */
            theme: {
                type: String,
                default: null,
                validator: v => THEMECOLORS.includes(v)
            }
        }
    },
    computed: {
        computedTag() {
            const _tagOrLink = ((!this.href && !this.to) ? this.tag : 'd-link')
            return this.button ? 'button' : _tagOrLink
        },
        isAction() {
            return Boolean(
                this.href
                || this.to
                || this.action
                || this.button
                || _actionTags.includes(this.tag)
            )
        }
    }
}
</script>

