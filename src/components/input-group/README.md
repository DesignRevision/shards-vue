# Input Groups

Using the `<d-input-group>` component you can easily extend form controls by adding various elements such as text, buttons and button groups.

## Basic Input Groups

:::demo
```html

<div>
    <!-- Using Props -->
    <d-input-group prepend="$" class="mb-2">
        <d-input placeholder="Total Amount"/>
    </d-input-group>

    <!-- Using Slots -->
    <d-input-group class="mb-2">
        <d-input placeholder="Total Amount"/>
        <d-input-group-text slot="append">$</d-input-group-text>
    </d-input-group>

    <!-- Using Components -->
    <d-input-group prepend="designrevision.com/user/">
        <d-input placeholder="username" />
        <d-input-group-addon append>
            <d-btn theme="secondary">Check</d-btn>
        </d-input-group-addon>
    </d-input-group>
</div>

<!-- input-group-1.vue -->
```
:::

## Prepending and Appending via Props

The simplest way of attaching addons to your inputs would be by using the `prepend` or `append` props on the `<d-input-group>` component.

:::demo
```html

<d-input-group prepend="Total Amount" append=".00 (USD)" class="mb-2">
    <d-input/>
</d-input-group>

<!-- input-group-2.vue -->
```
:::

## Using Named Slots

If you'd like better control over your input group's contents, you can also use the `prepend` or `append` slots.

:::demo
```html

<d-input-group>
    <d-input-group-text slot="prepend">Total Amount</d-input-group-text>
    <d-input placeholder="Total Amount"/>
    <d-input-group-text slot="append">$</d-input-group-text>
</d-input-group>

<!-- input-group-3.vue -->
```
:::

## Using Input Group Addons

You can also use the `<d-input-group-addon>` component with the `append` or `prepend` props for more flexibility.

:::demo
```html

<d-input-group class="mb-2">
    <d-input-group-addon prepend>
        <d-btn outline theme="danger">Delete</d-btn>
    </d-input-group-addon>
    <d-input placeholder="Email Address"/>
    <d-input-group-addon append>
        <d-btn outline theme="success">Create</d-btn>
    </d-input-group-addon>
</d-input-group>

<!-- input-group-4.vue -->
```
:::

## Input Group Dropdowns

> Note: Using dropdowns inside input groups are currently not supported, but available on the [roadmap](/roadmap).

:::demo
```html

<div>
  <d-input-group prepend="Username">
    <d-form-input />
    <d-input-group-addon append>
        <d-dropdown text="Dropdown" variant="success">
        <d-dropdown-item>Action A</d-dropdown-item>
        <d-dropdown-item>Action B</d-dropdown-item>
        </d-dropdown>
    </d-input-group-addon>
  </d-input-group>
</div>

<!-- input-group-4.vue -->
```
:::



## Plain Checkboxes and Radios

:::demo
```html

<d-container>
  <d-row>
    <d-col lg="6">
      <d-input-group>
        <d-input-group-text slot="prepend">
            <input type="checkbox" aria-label="Checkbox for following text input">
        </d-input-group-text>
        <d-form-input type="text" aria-label="Text input with checkbox" />
      </d-input-group>
    </d-col>

    <d-col lg="6">
      <d-input-group>
        <d-input-group-text slot="prepend">
            <input type="radio" aria-label="Radio for following text input">
        </d-input-group-text>
        <d-form-input type="text" aria-label="Text input with radio button" />
      </d-input-group>
    </d-col>
  </d-row>
</d-container>

<!-- input-group-5.vue -->
```
:::

## Sizing

You can control the sizing of the `<d-input-group>` component using the `size` prop with the `sm` value for small input groups and `lg` for large input groups.

:::demo
```html

<div>
    <!-- Small -->
    <d-input-group prepend="$" class="mb-2" size="sm">
        <d-input placeholder="Total Amount"/>
    </d-input-group>

    <!-- Normal -->
    <d-input-group prepend="$" class="mb-2">
        <d-input placeholder="Total Amount"/>
    </d-input-group>

    <!-- Large -->
    <d-input-group prepend="$" class="mb-2" size="lg">
        <d-input placeholder="Total Amount"/>
    </d-input-group>
</div>

<!-- input-group-6.vue -->
```
:::

## Seamless Input Groups

You can create seamless input groups using the `seamless` prop.

:::demo
```html

<d-input-group seamless>
    <d-input-group-text slot="prepend">
        <fa :icon="['fas', 'dollar-sign']" />
    </d-input-group-text>
    <d-input placeholder="Total Amount"/>
</d-input-group>

<!-- input-group-7.vue -->
```
:::
