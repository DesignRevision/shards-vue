# Badges

Badges are the perfect component for labels and count values.

## Contextual Variations

Using the `theme` prop you can easily change the appearance of your badge using the main theme colors: `primary, secondary, success, danger, warning, info, light` and `dark`.

:::demo
```html
<div>
    <d-badge theme="primary">Primary</d-badge>
    <d-badge theme="secondary">Secondary</d-badge>
    <d-badge theme="success">Success</d-badge>
    <d-badge theme="danger">Danger</d-badge>
    <d-badge theme="warning">Warning</d-badge>
    <d-badge theme="info">Info</d-badge>
    <d-badge theme="light">Light</d-badge>
    <d-badge theme="dark">Dark</d-badge>
</div>

<!-- badges-1.vue -->
```
:::

## Pill-Shaped Badges

Using the `pill` prop appiles a larger border radius that make your badges to look rounded.

:::demo
```html
<div>
    <d-badge pill theme="primary">Primary</d-badge>
    <d-badge pill theme="secondary">Secondary</d-badge>
    <d-badge pill theme="success">Success</d-badge>
    <d-badge pill theme="danger">Danger</d-badge>
    <d-badge pill theme="warning">Warning</d-badge>
    <d-badge pill theme="info">Info</d-badge>
    <d-badge pill theme="light">Light</d-badge>
    <d-badge pill theme="dark">Dark</d-badge>
</div>

<!-- badges-2.vue -->
```
:::

## Outline Badges

Using the `outline` prop removes the background color and applies a thin border that make your badges to look outlined.

:::demo
```html
<div>
    <d-badge outline theme="primary">Primary</d-badge>
    <d-badge outline theme="secondary">Secondary</d-badge>
    <d-badge outline theme="success">Success</d-badge>
    <d-badge outline theme="danger">Danger</d-badge>
    <d-badge outline theme="warning">Warning</d-badge>
    <d-badge outline theme="info">Info</d-badge>
    <d-badge outline theme="light">Light</d-badge>
    <d-badge outline theme="dark">Dark</d-badge>
</div>

<!-- badges-3.vue -->
```
:::

## Mixed Effects

You can also mix both `pill` and `outline` props to get mixed results.

:::demo
```html
<div>
    <d-badge outline pill theme="primary">Primary</d-badge>
    <d-badge outline pill theme="secondary">Secondary</d-badge>
    <d-badge outline pill theme="success">Success</d-badge>
    <d-badge outline pill theme="danger">Danger</d-badge>
    <d-badge outline pill theme="warning">Warning</d-badge>
    <d-badge outline pill theme="info">Info</d-badge>
    <d-badge outline pill theme="light">Light</d-badge>
    <d-badge outline pill theme="dark">Dark</d-badge>
</div>

<!-- badges-4.vue -->
```
:::

## Link Badges

Using the `href` or `to` prop you can turn your badges into regular or router links. 

:::demo
```html
<div>
    <d-badge href="#" theme="primary">Primary</d-badge>
    <d-badge href="#" theme="secondary">Secondary</d-badge>
    <d-badge href="#" theme="success">Success</d-badge>
    <d-badge href="#" theme="danger">Danger</d-badge>
    <d-badge href="#" theme="warning">Warning</d-badge>
    <d-badge href="#" theme="info">Info</d-badge>
    <d-badge href="#" theme="light">Light</d-badge>
    <d-badge href="#" theme="dark">Dark</d-badge>
</div>

<!-- badges-5.vue -->
```
:::

## Inherited Props

> **Note:** This component is also inheriting the [Link](/docs/components/link) component's props.
