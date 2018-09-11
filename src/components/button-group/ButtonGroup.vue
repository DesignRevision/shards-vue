<template>
    <div :class="[
            btnGroupSizeClass,
            vertical ? 'btn-group-vertical' : 'btn-group'
        ]"
        :aria-role="ariaRole"
        :aria-label="ariaLabel">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'd-button-group',
    props: {
        /**
         * Whether it is a vertical button group, or not.
         */
        vertical: {
            type: Boolean,
            default: false
        },
        /**
         * The button group size.
         */
        size: {
            type: String,
            validator: v => ['small', 'large', null].includes(v),
            default: null
        },
        /**
         * The button group's aria role.
         */
        ariaRole: {
            type: String,
            default: 'group'
        },
        /**
         * The button group's aria label.
         */
        ariaLabel: {
            type: String,
            default: 'Button group'
        }
    },
    computed: {
        btnGroupSizeClass() {
            const buttonGroupSizes = { small: 'sm', large: 'lg' };

            if (this.size !== '') {
                return `btn-group-${buttonGroupSizes[this.size]}`;
            }

            return this.size;
        }
    }
}
</script>

<style lang="scss" scoped>
    // TODO: This should be fixed in Shards.
    .btn-group-vertical .btn + .btn {
        margin-left: 0 !important;
    }
</style>

