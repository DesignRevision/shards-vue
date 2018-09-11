# Progres Bars

You can use the `<d-progress>` component to display simple or complex progress bars.

## Basic Example

:::demo 
```html

<d-progress :value="50" :max="100" />

<!-- progress-1.vue -->
```
:::

## Labels

You can add labels to your progress bars either by using the `show-progress` or `show-value` props.

:::demo 
```html

<div>
    <!-- Showing Percentage Progress -->
    <d-progress theme="success" :value="50" :max="250" show-progress />

    <!-- Showing Value -->
    <d-progress :value="50" :max="250" show-value />
</div>

<!-- progress-2.vue -->
```
:::

## Precision

Using the `precision` prop you can specify the precision number of digits.

:::demo 
```html

<d-progress :value="66.29123" :max="100" :precision="2" show-progress />

<!-- progress-3.vue -->
```
:::

## Multiple Progress Bars

Inside the `<d-progress>` component you can also stack multiple `<d-progress-bar>` components.

:::demo 
```html

<d-progress :max="100" show-value>
    <d-progress-bar :value="50" theme="primary"></d-progress-bar>
        <d-progress-bar :value="30" theme="warning"></d-progress-bar>
        <d-progress-bar :value="10" theme="info"></d-progress-bar>
</d-progress>

<!-- progress-4.vue -->
```

## Height

Using the `height` prop you can control the progress bar's height.

:::demo 
```html

<div>
    <d-progress :max="100" :value="50" height="15px" class="mb-2" />
    <d-progress :max="100" :value="50" height="3px" />
</div>
<!-- progress-5.vue -->
```
