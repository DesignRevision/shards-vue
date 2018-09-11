# Popovers

Popovers are powerful elements similar to tooltips and powered by Popper.js that can be applies to any interactive element.

> Note: The `container` prop is not always necessary and it is required in the following examples just for demo purposes.

## Basic Example

Popovers can be created using the `<d-popover>` component.

:::demo
```html

<div>
    <d-btn id="popover-example-1">Click Me</d-btn>
    <d-popover target="popover-example-1" container=".shards-demo--example--popover-01">
        <template slot="title">
            Title Here
        </template>
        Content Here
    </d-popover>
</div>

<!-- popover-1.vue -->
```
:::

## Triggers

The `<d-popover>` component, by default is triggered by the `click` event. However, this can be easily adjusted using the `triggers` component which accepts one or multiple triggers.

:::demo
```html

<div>
    <d-btn id="popover-example-2">Hover Me</d-btn>
    <d-popover target="popover-example-2"
        container=".shards-demo--example--popover-02"
        :triggers="['hover']">
        <template slot="title">
            Title Here
        </template>
        Content Here
    </d-popover>
</div>

<!-- popover-2.vue -->
```
:::


## Placement

Using the `placement` prop you can adjust where your popover will be displayed. So far, the following positions are available: `top`, `topleft`, `topright`, `right`, `righttop`, `rightbottom`, `bottom`, `bottomleft`, `bottomright`, `left`, `lefttop`, and `leftbottom`.

:::demo
```html

<div>
    <d-btn id="popover-example-3">Click Me</d-btn>
    <d-popover target="popover-example-3"
        :placement="'rightbottom'"
        container=".shards-demo--example--popover-03">
        <template slot="title">
            Title Here
        </template>
        Content Here
    </d-popover>
</div>

<!-- popover-3.vue -->
```
:::
