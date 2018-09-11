# Button Groups

Button groups allow you to group buttons together on a single line.

## Basic Example

You can create button groups using the `<d-button-group>` component.

:::demo Default button group
```html
<d-button-group>
    <d-button>Left</d-button>
    <d-button>Middle</d-button>
    <d-button>Right</d-button>
</d-button-group>

<!-- button-group-1.vue -->
```
:::


## Button Group Size

The button group's size can be controlled via the `size` prop. The button group can be normal (default with no value), `small` or `large`.

:::demo
```html

<div>
    <!-- Large Button Group -->
    <d-button-group size="large" class="mr-2">
        <d-button>Large</d-button>
        <d-button>Large</d-button>
    </d-button-group>

    <!-- Normal Button Group -->
    <d-button-group class="mr-2">
        <d-button>Normal</d-button>
        <d-button>Normal</d-button>
    </d-button-group>

    <!-- Small Button Group -->
    <d-button-group size="small">
        <d-button>Small</d-button>
        <d-button>Small</d-button>
    </d-button-group>
</div>

<!-- button-group-3.vue -->
```
:::


## Vertical Button Group

You can stack button groups vertically using the `vertical` prop.

:::demo 
```html
<d-button-group vertical>
    <d-button>Button 1</d-button>
    <d-button>Button 2</d-button>
</d-button-group>

<!-- button-group-3.vue -->
```
:::


## Alias

The `<d-button-group>` component is also aliased as `<d-btn-group>`.
