# Breadcrumbs

Breadcrumbs are a great component for indicating the current page's location within a navigation.

## Basic Example

The `<d-breadcrumb>` component comes with an `:items` prop that accepts an array of objects representing each breadcrumb menu item.

:::demo
```html
<template>
  <d-breadcrumb :items="breadcrumbItems"/>
</template>

<script>
export default {
  data () {
    return {
      breadcrumbItems: [{
        text: 'Products',
        href: '#'
      }, {
        text: 'Home',
        href: '#'
      }, {
        text: 'Lightbulbs',
        active: true
      }]
    }
  }
}
</script>

<!-- breadcrumb-1.vue -->
```
:::

## Manual Breadcrumbs

You can also compose your own breadscumb structures using the `<d-breadcrumb-item>` component.

:::demo
```html

<d-breadcrumb>
    <d-breadcrumb-item :active="false" text="Products" href="#" />
    <d-breadcrumb-item :active="false" text="Home" href="#" />
    <d-breadcrumb-item :active="true" text="Lightbulbs" href="#" />
</d-breadcrumb>

<!-- breadcrumb-2.vue -->
```
:::
