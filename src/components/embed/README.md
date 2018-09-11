# Embeds

Embeds allow you to create responsive video or slideshow embeds based on the width of the parent.

## Basic Example

The following embed types are supported: `iframe` (by default), `video`, `object` and `embed`.

:::demo
```html

<d-embed type="iframe"
        aspect="16by9"
        src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
        allowfullscreen />

<!-- embeds-1.vue -->
```
:::

## Aspect Ratios

You can also set the embed aspect ratio via the `aspect` prop. The following aspect ratios are available: `21by9`, `16by9`, `4by3`, `1by1`.
