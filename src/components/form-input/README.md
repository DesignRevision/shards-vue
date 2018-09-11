# Form Input

The form input allows you to create various text style inputs such as `text`, `password`, `email`, `number`, `url`, `search` and more.

## Alias

The `<d-form-input>` component is also available as `<d-input>`.

## Basic Input

The `<d-form-input>` component is a `text` input by default. However, you can set its type prop to one of the supported types as well: `text`, `password`, `email`, `number`, `url`, `tel`, `search`, `date`, `datetime`, `datetime-local`, `month`, `week`, `time`.

:::demo
```html

<template>
    <div>
        <d-input v-model="inputValue" class="mb-2" />
        <div v-if="inputValue">🤔 So you're saying: {{ inputValue }}</div>
        <div v-else>😃 Waiting for you to say something!</div>
    </div>
</template>

<script>
export default {
    data: {
        inputValue: ''
    }
}
</script>

<!-- form-input-1.vue -->
```
:::

## Supported Types

The following input types are currently supported.

:::demo
```html

<template>
  <d-container fluid>
    <d-row class="my-1" v-for="type in inputTypes" :key="type">
      <d-col sm="3"><label :for="`type-${type}`">Type {{ type }}:</label></d-col>
      <d-col sm="9"><d-form-input :id="`type-${type}`" :type="type"></d-form-input></d-col>
    </d-row>
  </d-container>
</template>

<script>
export default {
  data () {
    return {
      inputTypes: ['text', 'password', 'email', 'number', 'url','tel', 'date', 'time']
    }
  }
}
</script>

<!-- form-input-2.vue -->
```
:::

> Note: The `range` and `color` input types are currently not supported.

## Sizing

Using the `size` prop, you can change the input size as small (`sm`) or large (`lg`).

:::demo
```html

<div>
    <d-form-input size="sm" type="text" placeholder="I'm small" class="mb-2"></d-form-input>
    <d-form-input type="text" placeholder="I'm normal" class="mb-2"></d-form-input>
    <d-form-input size="lg" type="text" placeholder="I'm large"></d-form-input>
</div>

<!-- form-input-3.vue -->
```
:::

## Validation States

Using the `state` prop on the `<d-form-input>` component you can control the input's validation state.

The following input states are available:

* `invalid` when the input is invalid.
* `valid` when the use input is valid.
* `null` when the input should display no validation state (neutral).

:::demo
```html

<div>
    <d-form-input type="text" placeholder="I'm Neutral" class="mb-2"></d-form-input>
    <d-form-input :state="true" type="text" placeholder="I'm Valid" class="mb-2"></d-form-input>
    <d-form-input state="invalid" type="text" placeholder="I'm Invalid"></d-form-input>
</div>

<!-- form-input-4.vue -->
```
:::

## Readonly & Plaintext

You can also display the input as readonly or plain text using the `readonly` and `plaintext` props.
