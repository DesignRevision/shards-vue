<template>
    <div class="btn-toolbar"
        :aria-role="ariaRole"
        :aria-label="ariaLabel">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'd-button-toolbar',
    props: {
        /**
         * Button toolbar aria role.
         */
        ariaRole: {
            type: String,
            default: 'toolbar'
        },
        /**
         * Button toolbar aria label.
         */
        ariaLabel: {
            type: String,
            default: 'Button toolbar'
        }
    }
}
</script>
