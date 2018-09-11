# Slider

The slider component is powered behind the scenes by the [NoUiSlider](https://refreshless.com/nouislider/) library.

## Basic Slider

You can create basic sliders using the `<d-slider>` component and a `v-model`.

:::demo
```html

<template>
    <d-slider v-model="sliderValue" :value="20" />
    <span>Slider Value: {{ sliderValue }}</span>
</template>

<script>
    export default {
        data() {
            return {
                sliderValue: 20
            }
        }
    }
</script>

<!-- slider-1.vue -->
```
:::

## Using Start Values

Using the `start` prop you can also specify a start value for the knob.

:::demo
```html

<d-slider :start="20" :value="20" />

<!-- slider-2.vue -->
```
:::

## Custom Range

If the default `1-100` range is not enough, you can override it using the `range` prop.

:::demo
```html

<template>
    <d-slider v-model="sliderValue" :value="1342" :range="{ min: 100, max: 2000 }"/>
    <span>Slider Value: {{ sliderValue }}</span>
</template>

<script>
    export default {
        data() {
            return {
                sliderValue: 1342
            }
        }
    }
</script>
<!-- slider-3.vue -->
```
:::

## Multiple Values

If you'd like to control multiple values, you can use an `Array` for the `value` prop.

:::demo
```html

<template>
    <d-slider v-model="sliderValue" :value="['10.00', '80.00']" :connect="true"/>
    <span>Slider Value: {{ sliderValue }}</span>
</template>

<script>
    export default {
        data() {
            return {
                sliderValue: ['10.00', '80.00']
            }
        }
    }
</script>
<!-- slider-4.vue -->
```
:::

## Using Pips

Pips can also be enabled via the `options` prop.

:::demo
```html

<template>
    <d-slider v-model="sliderValue"
            :value="['10.00', '80.00']"
            :options="{ pips: { mode: 'steps', stepped: true, density: 3 } }"
            :connect="true" />
    <span>Slider Value: {{ sliderValue }}</span>
</template>

<script>
    export default {
        data() {
            return {
                sliderValue: ['10.00', '80.00']
            }
        }
    }
</script>
<!-- slider-5.vue -->
```
:::
