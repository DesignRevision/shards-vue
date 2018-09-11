# Form Radio

The `<d-form-radio>` component is a wrapper over Bootstrap's [custom radio component](https://getbootstrap.com/docs/4.1/components/forms/#checkboxes-and-radios-1).

## Alias

The `<d-form-radio>` component is also available as `<d-radio>`.

## Basic Demo

:::demo
```html
<template>
    <div>
        <label>Select your favorite fruits:</label>
        <d-form-radio v-model="selected" value="orange">Orange</d-form-radio>
        <d-form-radio v-model="selected" value="lemon">Lemon</d-form-radio>
        <d-form-radio v-model="selected" value="kiwi">Kiwi</d-form-radio>
        <p>Selected Status: {{ selected }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: 'orange'
        }
    }
}
</script>

<!-- radio-1.vue -->
```
:::

## Inline Display

Radios can also be displayed inline using the `inline` prop.

:::demo
```html

<div>
    <label class="d-block">Select your favorite sport</label>
    <d-form-radio inline name="fav_sport" value="basketball">Basketball</d-form-radio>
    <d-form-radio inline name="fav_sport" value="football">Football</d-form-radio>
    <d-form-radio inline name="fav_sport" value="tennis">Tennis</d-form-radio>
</div>

<!-- radio-2.vue -->
```
:::

## Missing Features

The following radio features are currently not supported, but available on the [roadmap](/roadmap).

* Possibility of creating plain radios.
* Radio groups.
* Button style radios.
