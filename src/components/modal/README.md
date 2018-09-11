# Modals

Creating flexible modal dialogs can be achieved using the `<d-modal>` component. They feature a series of helpful subcomponents, sizes and various other options that you can use to customize the display and behavior of your modals.

## Basic Example

:::demo
```html
<template>
    <div>Modal opened: <span :class="[showModal ? 'text-success' : 'text-danger']">{{ showModal }}</span></div>
    <d-btn @click.native="handleClick">Click Me</d-btn>
    <d-modal v-if="showModal" @close="handleClose">
        <d-modal-header>
            <d-modal-title>Header</d-modal-title>
        </d-modal-header>
        <d-modal-body>👋 Hello there!</d-modal-body>
    </d-modal>
</template>

<script>
export default {
    data() {
        return {
            showModal: false,
        }
    },
    methods: {
        handleClick() {
            this.showModal = true
        },
        handleClose() {
            this.showModal = false
        }
    }
};
</script>

<!-- modal-1.vue -->
```
:::

## Modal Size

Using the `size` prop on the `<d-modal>` component, you can control the size of your modal.

:::demo
```html
<template>
    <d-btn @click.native="showModal = true">Click Me</d-btn>
    <d-modal v-if="showModal" size="sm" @close="showModal = false" :size="modalSize">
        <d-modal-header>
            <d-modal-title>Hello</d-modal-title>
        </d-modal-header>
        <d-modal-body>
            <div class="mb-3">👋 I'm a <span v-html="modalSize === 'sm' ? 'small' : 'large'" /> modal!</div>
            <d-btn @click="modalSize = modalSize === 'sm' ? 'lg' : 'sm'">Toggle Size</d-btn>
        </d-modal-body>
    </d-modal>
</template>

<script>
export default {
    data() {
        return {
            showModal: false,
            modalSize: 'sm'
        }
    }
};
</script>

<!-- modal-2.vue -->
```
:::
