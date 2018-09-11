# Buttons

Buttons are Bootstrap's core component for triggering various actions. In Shards, they're very flxible, support multiple sizes, states and many more.


## Button Themes

Using the `theme` prop you can easily change the appearance of your button using one the main theme colors: `primary, secondary, success, danger, warning, info, light` and `dark`. The default theme value is `primary`.

:::demo
```html
<d-button>Primary</d-button>
<d-button theme="secondary">Secondary</d-button>
<d-button theme="success">Success</d-button>
<d-button theme="info">Info</d-button>
<d-button theme="warning">Warning</d-button>
<d-button theme="danger">Danger</d-button>
<d-button theme="light">Light</d-button>
<d-button theme="dark">Dark</d-button>

<!-- buttons-1.vue -->
```
:::


## Outline Styled Buttons

Using the `outline` prop removes the background color and applies a thin border that make your buttons to look outlined.

:::demo
```html
<d-button outline>Primary</d-button>
<d-button outline theme="secondary">Secondary</d-button>
<d-button outline theme="success">Success</d-button>
<d-button outline theme="info">Info</d-button>
<d-button outline theme="warning">Warning</d-button>
<d-button outline theme="danger">Danger</d-button>
<d-button outline theme="light">Light</d-button>
<d-button outline theme="dark">Dark</d-button>

<!-- buttons-2.vue -->
```
:::


## Pill Shaped Buttons

Using the `pill` prop appiles a larger border radius that make your buttons to look more rounded and pill-like.

:::demo
```html
<d-button pill>Primary</d-button>
<d-button pill theme="secondary">Secondary</d-button>
<d-button pill theme="success">Success</d-button>
<d-button pill theme="info">Info</d-button>
<d-button pill theme="warning">Warning</d-button>
<d-button pill theme="danger">Danger</d-button>
<d-button pill theme="light">Light</d-button>
<d-button pill theme="dark">Dark</d-button>

<!-- buttons-3.vue -->
```
:::


## Mixed Styles

Similarly to [Badges](/docs/components/badges) you can also mix both `pill` and `outline` props to get a mixed "outline-pill" result.

:::demo
```html
<d-button outline pill>Primary</d-button>
<d-button outline pill theme="secondary">Secondary</d-button>
<d-button outline pill theme="success">Success</d-button>
<d-button outline pill theme="info">Info</d-button>
<d-button outline pill theme="warning">Warning</d-button>
<d-button outline pill theme="danger">Danger</d-button>
<d-button outline pill theme="light">Light</d-button>
<d-button outline pill theme="dark">Dark</d-button>

<!-- buttons-4.vue -->
```
:::


## Squared Style

Using the `squared` prop you can style your buttons to look, well, squared.

:::demo
```html
<d-button squared>Primary</d-button>
<d-button squared theme="secondary">Secondary</d-button>
<d-button squared theme="success">Success</d-button>
<d-button squared theme="info">Info</d-button>
<d-button squared theme="warning">Warning</d-button>
<d-button squared theme="danger">Danger</d-button>
<d-button squared theme="light">Light</d-button>
<d-button squared theme="dark">Dark</d-button>

<!-- buttons-5.vue -->
```
:::

> **Note:** The `pill` prop has priority over the `squared` prop. 


## Mixed Outline-Squared Style

Mixing the `outline` and `squared` prop is also possible and it will render an outlined and squared button. 

:::demo
```html
<d-button outline squared>Primary</d-button>
<d-button outline squared theme="secondary">Secondary</d-button>
<d-button outline squared theme="success">Success</d-button>
<d-button outline squared theme="info">Info</d-button>
<d-button outline squared theme="warning">Warning</d-button>
<d-button outline squared theme="danger">Danger</d-button>
<d-button outline squared theme="light">Light</d-button>
<d-button outline squared theme="dark">Dark</d-button>

<!-- buttons-6.vue -->
```
:::


## Button Sizes

Buttons come in three size variations: `lg`, normal (default) and `sm`. You can control the size of your buttons using the `size` prop.

:::demo
```html
<d-button size="lg">Large</d-button>
<d-button>Normal</d-button>
<d-button size="sm">Small</d-button>

<!-- buttons-7.vue -->
```
:::


## Active State

If you need to control the `active` state and appearance of your button programatically, you can use the `active` prop.

:::demo
```html
<d-button active theme="success">Success Active</d-button>
<d-button active theme="danger">Danger Active</d-button>

<!-- buttons-8.vue -->
```
:::


## Disabled State

Similarly to the active state, the `disabled` state can also be crontrolled via the `disabled` prop.

:::demo 
```html
<d-button disabled theme="success">Success Disabled</d-button>
<d-button disabled theme="danger">Danger Disabled</d-button>

<!-- buttons-9.vue -->
```
:::


## Toggle State

Toggling a button's state is currently not supported, but available on the [roadmap](/roadmap).


## Change Tags

Changing the button's tag (eg. using native `<a>` or `<input>` elements) is currently not supported, but available on the [roadmap](/roadmap).


## Block Level Buttons

Using the `block-level` prop you can make buttons display using the full-width of their parent element

:::demo 
```html
<d-button block-level>Primary</d-button>
<d-button block-level theme="secondary">Secondary</d-button>

<!-- buttons-10.vue -->
```
:::


## Alias

The `<d-button>` component is also available as `<d-btn>`.
