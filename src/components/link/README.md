# Links

The `<d-link>` component is a wrapper over regular `<a>` links or `<router-link>`s and it is used behind the scenes across multiple components. 

> **Note:** Most components that use the `<d-link>` component are properly documented so you can see where you can take advantage of the props provided by this component.


## Basic Example

Creating a regular link using the `<d-link>` component is fairly simple.

:::demo
```html

<d-link href="#lorem-ipsum">My Link</d-link>

<!-- link-1.vue -->
```
:::

## Router Links

Using the `to` prop will turn the link into a `<router-link>` component.

## Disabled State

Using the `disabled` prop you can set your link as disabled.
