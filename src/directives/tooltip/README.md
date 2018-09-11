# Tooltip

The `v-d-tooltip` directive can be applied to any component in order to create powerful and dynamic tooltips.

## Basic Example

:::demo
```html

<d-button v-d-tooltip="'👋 Hello there!'">Hover Me</d-button>

<!-- tooltip-1.vue -->
```
:::

## Placement

Changing the tooltip's placement can be achieved using the, `auto`, `top`, `bottom`, `left`, `right`, `topleft`, `topright`, `bottomleft`, `bottomright`, `lefttop`, `leftbottom`, `righttop` or `rightbottom` modifiers.

:::demo
```html

<d-button v-d-tooltip.bottomright="'I\'m down here!'">Hover Me</d-button>

<!-- tooltip-2.vue -->
```
:::

## Triggers

You can change the default trigger (hover) using either the `click`, `hover` or `focus` modifier.

:::demo
```html

<d-button v-d-tooltip.click="'👋 Hello there!'">Click Me</d-button>

<!-- tooltip-3.vue -->
```
:::


