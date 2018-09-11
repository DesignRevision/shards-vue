# Tabs

Using the `<d-tabs>` component you can easily create tabbable panes of content.

:::demo
```html

<d-tabs>
    <d-tab title="Tab 1" active>
        <div class="p-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur eros tellus. Fusce mollis felis a lorem euismod sollicitudin. Maecenas et porttitor mauris.</div>
    </d-tab>
    <d-tab title="Tab 2">
        <div class="p-3">Sed at lacus efficitur, imperdiet purus et, pretium arcu. Mauris vulputate, libero in dignissim auctor, nunc tortor interdum elit, ac dignissim ex enim vitae diam.</div>
    </d-tab>
</d-tabs>

<!-- tabs-1.vue -->
```
:::


## Cards

Wrapping the `<d-tabs>` component inside a `<d-card>` component you can also display the tabs as cards.

:::demo
```html

<d-card>
    <d-tabs card>
        <d-tab title="Tab 1" active>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur eros tellus. Fusce mollis felis a lorem euismod sollicitudin. Maecenas et porttitor mauris.
        </d-tab>
        <d-tab title="Tab 2">
            Sed at lacus efficitur, imperdiet purus et, pretium arcu. Mauris vulputate, libero in dignissim auctor, nunc tortor interdum elit, ac dignissim ex enim vitae diam.
        </d-tab>
    </d-tabs>
</d-card>

<!-- tabs-2.vue -->
```
:::


## Pills

Using the `pills` prop you can turn your tab controls into 'pill' buttons.

:::demo
```html

<d-card>
    <d-tabs card pills>
        <d-tab title="Tab 1" active>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur eros tellus. Fusce mollis felis a lorem euismod sollicitudin. Maecenas et porttitor mauris.
        </d-tab>
        <d-tab title="Tab 2">
            Sed at lacus efficitur, imperdiet purus et, pretium arcu. Mauris vulputate, libero in dignissim auctor, nunc tortor interdum elit, ac dignissim ex enim vitae diam.
        </d-tab>
    </d-tabs>
</d-card>

<!-- tabs-3.vue -->
```
:::


## Vertical Tabs

Placing the tab controls vertically can be easily achieved using the `vertical` prop.

:::demo
```html

<d-card>
    <d-tabs card pills vertical>
        <d-tab title="Tab 1" active>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur eros tellus. Fusce mollis felis a lorem euismod sollicitudin. Maecenas et porttitor mauris.
        </d-tab>
        <d-tab title="Tab 2">
            Sed at lacus efficitur, imperdiet purus et, pretium arcu. Mauris vulputate, libero in dignissim auctor, nunc tortor interdum elit, ac dignissim ex enim vitae diam.
        </d-tab>
    </d-tabs>
</d-card>

<!-- tabs-4.vue -->
```
:::


## Disabled Tab Controls

You can set some of your tab controls as disabled, using the `disabled` prop

:::demo
```html

<d-card>
    <d-tabs card pills vertical>
        <d-tab title="Tab 1" active>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur eros tellus. Fusce mollis felis a lorem euismod sollicitudin. Maecenas et porttitor mauris.
        </d-tab>
        <d-tab title="Disabled" disabled>
            Sed at lacus efficitur, imperdiet purus et, pretium arcu. Mauris vulputate, libero in dignissim auctor, nunc tortor interdum elit, ac dignissim ex enim vitae diam.
        </d-tab>
    </d-tabs>
</d-card>

<!-- tabs-5.vue -->
```
:::
