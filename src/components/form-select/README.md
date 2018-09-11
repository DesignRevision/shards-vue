# Form Select

The `<d-form-select>` component is a wrapper over Bootstrap's [custom select component](https://getbootstrap.com/docs/4.1/components/forms/#select-menu).

## Alias

The `<d-form-select>` component is also available as `<d-select>`.

## Basic Examples

The easiest way of using the `<d-form-select>` component would be by using the `options` prop to pass an `Array` or `Object` for the options.

:::demo
```html
<template>
    <d-form-select v-model="selected" :options="options" />
    Selected: {{ selected }}
</template>

<script>
export default {
    data() {
        return {
            selected: null,
            options: [
                { value: null, text: 'Please select an option' },
                { value: 'first', text: 'This is the first option' },
                { value: 'second', text: 'This is the second option' },
                { value: 'disabled', text: 'This one is disabled', disabled: true }
            ]
        }
    }
}
</script>

<!-- select-1.vue -->
```
:::

## Sizing

You can control the form-control's size using the `size` prop which accepts `sm` for small or `lg` for large.

## Manual Options

You can also define your options manually:

:::demo
```html
<template>
  <div>
    <d-form-select v-model="selected" class="mb-3">
      <option :value="null">Select an option</option>
      <option value="pizza">🍕Pizza</option>
      <option value="pasta" disabled>🍝 Pasta (disabled)</option>
      <optgroup label="Breakfast">
        <option value="eggs">🍳 Eggs</option>
        <option value="bacon">🥓 Bacon</option>
        <option value="tea">🍵 Tea</option>
      </optgroup>
    </d-form-select>
    <div>Selected: {{ selected }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: null
    }
  }
}
</script>

<!-- select-2.vue -->
```
:::

## Mixed Options

You can also mix both using the `options` prop and usin manual options.

:::demo
```html
<template>
  <div>
    <d-form-select v-model="selected" :options="options" class="mb-3">
      <optgroup label="Breakfast">
        <option value="eggs">🍳 Eggs</option>
        <option value="bacon">🥓 Bacon</option>
      </optgroup>
    </d-form-select>
    <div>Selected: {{ selected }}</div>
  </div>
</template> 

<script>
export default {
  data () {
    return {
        selected: null,
        options: [
            { value: null, text: 'Select an option' },
            { value: 'pizza', text: '🍕 Pizza' },
            { value: 'pasta', text: '🍝 Pasta', disabled: true },
        ]
    }
  }
}
</script>

<!-- select-3.vue -->
```
:::

## Select Sizing

Using the `select-size` prop you can switch the custom select into a select list box. The prop accepts a number larger than 1 to control how many options are visible.

:::demo
```html
<template>
    <d-form-select v-model="selected" :options="options" :select-size="2" />
    Selected: {{ selected }}
</template>

<script>
export default {
    data() {
        return {
            selected: null,
            options: [
                { value: null, text: 'Please select an option' },
                { value: 'first', text: 'This is the first option' },
                { value: 'second', text: 'This is the second option' },
                { value: 'disabled', text: 'This one is disabled', disabled: true }
            ]
        }
    }
}
</script>

<!-- select-4.vue -->
```
:::

## Multiple Selections


Using the `multiple` prop you can allow users to select multiple values from the `<d-form-select>` component.

> Note: Using the `multiple` mode requires an `Array` reference for your `v-model`.

:::demo
```html
<template>
    <d-form-select multiple :select-size="4" v-model="selected" :options="options" />
    Selected: {{ selected }}
</template>

<script>
export default {
    data() {
        return {
            selected: [],
            options: [
                { value: 'first', text: 'This is the first option' },
                { value: 'second', text: 'This is the second option' },
                { value: 'third', text: 'This is the third option' },
                { value: 'fourth', text: 'This is the fourth option' }
            ]
        }
    }
}
</script>

<!-- select-5.vue -->
```
:::
