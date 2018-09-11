# Navs

The `<d-nav>` component allows you to build all types of navigation components.

## Basic Demo

Creating navs can be easily achieved using the `<d-nav>` component together with the `<d-nav-item>` component.
 
:::demo
```html

<d-nav>
  <d-nav-item active>Active</d-nav-item>
  <d-nav-item>Link</d-nav-item>
  <d-nav-item>Another Link</d-nav-item>
  <d-nav-item disabled>Disabled</d-nav-item>
</d-nav>

<!-- nav-1.vue -->
```
:::

## Tabs Style

Using the `tabs` prop, you can style the navs to look like tabs.

:::demo
```html

<d-nav tabs>
  <d-nav-item active>Active</d-nav-item>
  <d-nav-item>Link</d-nav-item>
  <d-nav-item>Another Link</d-nav-item>
  <d-nav-item disabled>Disabled</d-nav-item>
</d-nav>

<!-- nav-2.vue -->
```
:::

## Pill Style

Using the `pills` prop you can style the navs to look like pills.

:::demo
```html

<d-nav pills>
  <d-nav-item active>Active</d-nav-item>
  <d-nav-item>Link</d-nav-item>
  <d-nav-item>Another Link</d-nav-item>
  <d-nav-item disabled>Disabled</d-nav-item>
</d-nav>

<!-- nav-3.vue -->
```
:::

## Fill

Using the `fill` prop, you can force the nav content to extend the full available width.

:::demo
```html

<d-nav fill>
  <d-nav-item active>Active</d-nav-item>
  <d-nav-item>Link</d-nav-item>
  <d-nav-item>Another Link</d-nav-item>
  <d-nav-item disabled>Disabled</d-nav-item>
</d-nav>

<!-- nav-4.vue -->
```
:::

## Justified

Using the `justified` prop, you can define equal-width nav elements.

:::demo
```html

<d-nav justified>
  <d-nav-item active>Active</d-nav-item>
  <d-nav-item>Link</d-nav-item>
  <d-nav-item>Another Link</d-nav-item>
  <d-nav-item disabled>Disabled</d-nav-item>
</d-nav>

<!-- nav-5.vue -->
```
:::

