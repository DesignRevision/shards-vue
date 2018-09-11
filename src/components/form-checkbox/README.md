# Form Checkbox

The `<d-form-checkbox>` component is a wrapper over Bootstrap's [custom checkbox component](https://getbootstrap.com/docs/4.1/components/forms/#checkboxes-and-radios-1).

## Alias

The `<d-form-checkbox>` component is also available as `<d-checkbox>`.

## Basic Demo

:::demo
```html
<template>
    <div>
        <label>Select your favorite fruits</label>
        <d-checkbox v-model="selected" name="fav_fruits" value="orange">Orange</d-checkbox>
        <d-checkbox v-model="selected" name="fav_fruits" value="lemon">Lemon</d-checkbox>
        <d-checkbox v-model="selected" name="fav_fruits" value="kiwi">Kiwi</d-checkbox>
        <p>Checked Status: {{ selected }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: ['orange']
        }
    }
}
</script>

<!-- checkbox-1.vue -->
```
:::

## Toggles

Checkboxes can be turned into toggles by using the `toggle` prop.

:::demo
```html


<template>
    <div class="mb-3">
        <d-checkbox inline v-model="enabled" toggle>Enable Rockets <span v-if="enabled">- 🚀🚀 Rockets enabled! 🚀🚀</span> </d-checkbox>
    </div>
</template>

<script>
export default {
    data() {
        return {
            enabled: false
        }
    }
}
</script>

<!-- checkbox-2.vue -->
```
:::


## Inline Display

Checkboxes can also be displayed inline using the `inline` prop.

:::demo
```html
<div>
    <label class="d-block">Select your favorite sports</label>
    <d-checkbox inline checked="basketball" name="fav_sports" value="basketball">Basketball</d-checkbox>
    <d-checkbox inline name="fav_sports" value="football">Football</d-checkbox>
    <d-checkbox inline name="fav_sports" value="Tennis">Tennis</d-checkbox>
</div>

<!-- checkbox-3.vue -->
```
:::

## Values

By default, the `<d-form-checkbox>` component's value will be `true` or `false` depending on its checked state. However, this can be easily adjusted using the `value` and `unchecked-value` props.

## Indeterminate State

:::demo
```html
<template>
  <div>
    <d-form-checkbox v-model="checked" :indeterminate.sync="indeterminate">
      I'm <span v-if="indeterminate">indeterminate 😕</span><span v-else-if="checked">checked 😊</span><span v-else>not checked! 😟</span>
    </d-form-checkbox>

    <div class="my-3">
      Checked: <strong>{{ checked }}</strong><br>
      Indeterminate: <strong>{{ indeterminate }}</strong>
    </div>
    <d-btn @click="toggleIndeterminateState">Toggle Indeterminate</d-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checked: true,
      indeterminate: true
    }
  },
  methods: {
    toggleIndeterminateState () {
      this.indeterminate = !this.indeterminate
    }
  }
}
</script>

<!-- checkbox-4.vue -->
```
:::

## Missing Features

The following checkbox features are currently not supported, but available on the [roadmap](/roadmap).

* Possibility of creating plain checkboxes.
* Checkbox groups.
* Button style checkboxes.
