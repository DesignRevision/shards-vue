# Dropdowns

You can use dropdowns to display accessible contextual overlays for displaying lists of links and more.


## Basic Example

You can create dropdowns using the `<d-dropdown>` component.

:::demo
```html
<d-dropdown text="Dropdown">
    <d-dropdown-item>Action</d-dropdown-item>
    <d-dropdown-item>Another action</d-dropdown-item>
    <d-dropdown-item>Something else here</d-dropdown-item>
    <d-dropdown-divider />
    <d-dropdown-item>Separated link</d-dropdown-item>
</d-dropdown>

<!-- dropdown-1.vue -->
```
:::


## Theme Color

Changing the theme color can be easily achieved using the `theme` prop.

:::demo
```html
<d-dropdown text="Dropdown" theme="success">
    <d-dropdown-item>Action</d-dropdown-item>
    <d-dropdown-item>Another action</d-dropdown-item>
    <d-dropdown-item>Something else here</d-dropdown-item>
    <d-dropdown-divider />
    <d-dropdown-item>Separated link</d-dropdown-item>
</d-dropdown>

<!-- dropdown-2.vue -->
```
:::


## Positioning

By default dropdown menus are left aligned. However, you can change this by applying a right alignment using the `right` prop.

:::demo
```html

<div>
    <d-dropdown text="Left Align" class="mr-2">
        <d-dropdown-item>Action</d-dropdown-item>
        <d-dropdown-item>Another action</d-dropdown-item>
        <d-dropdown-item>Something else here</d-dropdown-item>
        <d-dropdown-divider />
        <d-dropdown-item>Separated link</d-dropdown-item>
    </d-dropdown>

    <d-dropdown text="Right Align" right>
        <d-dropdown-item>Action</d-dropdown-item>
        <d-dropdown-item>Another action</d-dropdown-item>
        <d-dropdown-item>Something else here</d-dropdown-item>
        <d-dropdown-divider />
        <d-dropdown-item>Separated link</d-dropdown-item>
    </d-dropdown>
</div>

<!-- dropdown-3.vue -->
```
:::


## Drop-up

Turning dropdown menus into drop-up menus can be easily achieved using the `dropup` prop.

:::demo
```html
<d-dropdown text="Dropdown" dropup>
    <d-dropdown-item>Action</d-dropdown-item>
    <d-dropdown-item>Another action</d-dropdown-item>
    <d-dropdown-item>Something else here</d-dropdown-item>
    <d-dropdown-divider />
    <d-dropdown-item>Separated link</d-dropdown-item>
</d-dropdown>

<!-- dropdown-4.vue -->
```
:::


## Split Buttons

Using the `split` prop you can create split-type dropdowns. You can hook into the `click` event for the left-side button.

:::demo
```html
<template>
    <d-dropdown text="Dropdown" split @click="handleClick">
        <d-dropdown-item>Action</d-dropdown-item>
        <d-dropdown-item>Another action</d-dropdown-item>
        <d-dropdown-item>Something else here</d-dropdown-item>
        <d-dropdown-divider />
        <d-dropdown-item>Separated link</d-dropdown-item>
    </d-dropdown>
</template>

<script>
    export default {
        methods: {
            handleClick() {
                alert('Split button was clicked!')
            }
        }
    }
</script>

<!-- dropdown-5.vue -->
```
:::


## Sizing

Using the `size` prop you can control the dropdown button's size.

:::demo
```html
<div>
    <d-dropdown text="Large" size="lg">
        <d-dropdown-item>Action</d-dropdown-item>
        <d-dropdown-item>Another action</d-dropdown-item>
        <d-dropdown-item>Something else here</d-dropdown-item>
        <d-dropdown-divider />
        <d-dropdown-item>Separated link</d-dropdown-item>
    </d-dropdown>

    <d-dropdown text="Normal">
        <d-dropdown-item>Action</d-dropdown-item>
        <d-dropdown-item>Another action</d-dropdown-item>
        <d-dropdown-item>Something else here</d-dropdown-item>
        <d-dropdown-divider />
        <d-dropdown-item>Separated link</d-dropdown-item>
    </d-dropdown>

    <d-dropdown text="Small" size="sm">
        <d-dropdown-item>Action</d-dropdown-item>
        <d-dropdown-item>Another action</d-dropdown-item>
        <d-dropdown-item>Something else here</d-dropdown-item>
        <d-dropdown-divider />
        <d-dropdown-item>Separated link</d-dropdown-item>
    </d-dropdown>
</div>

<!-- dropdown-6.vue -->
```
:::


## Offsets

If you'd like to offset your dropdown menu, you can use the `offset` propto specify the number of pixels you would like to push the menu to either left or right depending on the value you are using *(positive for pushing, negative for pulling)*.

:::demo
```html
<d-dropdown text="Dropdown" offset="30">
    <d-dropdown-item>Action</d-dropdown-item>
    <d-dropdown-item>Another action</d-dropdown-item>
    <d-dropdown-item>Something else here</d-dropdown-item>
    <d-dropdown-divider />
    <d-dropdown-item>Separated link</d-dropdown-item>
</d-dropdown>

<!-- dropdown-7.vue -->
```
:::
