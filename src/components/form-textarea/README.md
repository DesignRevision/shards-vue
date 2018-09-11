# Form Textarea

The `<d-form-textarea>` component allows you to create multi-line text inputs that adjusts its height (text rows) automatically to fit the content. You can also limit the number of rows displayed using the `max-rows` prop. If you'd like to force the textarea element to a fixed height, you can use both `rows` and `max-rows` props simultaneously.

## Alias

The `<d-form-textarea>` component is also available as `<d-textarea>`.

## Basic Example

:::demo
```html
<template>
    <div>
        <d-form-textarea v-model="text"
                        placeholder="Enter something"
                        :rows="3"
                        :max-rows="6">
        </d-form-textarea>
        <span v-if="text" class="d-block my-2">🤔 So you're saying: {{ text }}</span>
    </div>
</template>

<script>
export default {
    data () {
        return {
            text: ''
        }
    }
}
</script>

<!-- textarea-1.vue -->
```
:::

## Validation

Using the `state` prop on the `<d-form-textarea>` component you can control the textarea's validation state.

The following textarea states are available:

* `invalid` when the textarea is invalid.
* `valid` when the use textarea is valid.
* `null` when the textarea should display no validation state (neutral).

:::demo
```html
<template>
    <div>
        <d-form-textarea state="valid"
                        v-model="text"
                        placeholder="You can start your novel right here..."
                        :rows="3"
                        :max-rows="6">
        </d-form-textarea>
        <span v-if="text" class="d-block my-2">🤔 So you're saying: {{ text }}</span>
    </div>
</template>

<script>
export default {
    data () {
        return {
            text: ''
        }
    }
}
</script>

<!-- textarea-2.vue -->
```
:::
