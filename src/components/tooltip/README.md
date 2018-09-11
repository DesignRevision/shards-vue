# Tooltips

Tooltips are powerful components powered behind the scenes by Popper.js that can be attached to any element.

> Note: The `container` prop is not always necessary and it is required in the following examples just for demo purposes.


## Directive

You can also create tooltips using the [tooltip directive](/docs/directives/tooltip).


## Basic Example

:::demo
```html

<div>
    <d-button id="example-tooltip-1"/>
    <d-tooltip target="#example-tooltip-1"
        container=".shards-demo--example--tooltip-01">
        😃 Wooo! I am a tooltip!
    </d-tooltip>
</div>

<!-- tooltip-1.vue -->
```
:::


## Placement

The tooltip's position can be changed via the `placement` prop. The following placement options are available: `top`, `topleft`, `topright`, `right`, `righttop`, `rightbottom`, `bottom`, `bottomleft`, `bottomright`, `left`, `lefttop`, and `leftbottom`.

:::demo
```html

<div>
    <d-button id="example-tooltip-2"/>
    <d-tooltip target="#example-tooltip-2"
        container=".shards-demo--example--tooltip-02"
        placement="right">
        👈 Wooo! I am on the left!
    </d-tooltip>
</div>

<!-- tooltip-2.vue -->
```
:::


## Triggers

Using the `triggers` prop you can control on which events the tooltip should be displayed.

:::demo
```html

<div>
    <d-button id="example-tooltip-3">Click Me</d-button>
    <d-tooltip target="#example-tooltip-3"
        container=".shards-demo--example--tooltip-03"
        :triggers="['click']">
        🖱 You just clicked me!
    </d-tooltip>
</div>

<!-- tooltip-3.vue -->
```
:::
