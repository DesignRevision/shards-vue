# Datepickers

Datepickers in Shards Vue are wrappers over the `vuejs-datepicker` component. You can learn more about the component in [the official component's GitHub repository](https://github.com/charliekassel/vuejs-datepicker), or follow the short guide below for an overview of how to use datepickers in Shards Vue.

## Basic Example

Creating a datepicker can be easily achieved using the `<d-datepicker>` component.

:::demo
```html

<template>
    <div>
        <div>Opened: <span :class="[opened ? 'text-success' : 'text-danger']">{{ opened }}</span></div>
        <div>📅 Date: <span>{{ date }}</span></div>
        <d-datepicker
            v-model="date"
            @opened="handleOpened"
            @closed="handleClosed"
            typeable />
    </div>
</template>

<script>
export default {
  data() {
    return {
        opened: false,
        date: new Date(2018, 8, 23)
    }
  },
  methods: {
      handleOpened() {
          this.opened = true
      },
      handleClosed() {
          this.opened = false
      }
  }
}
</script>

<!-- datepicker-1.vue -->
```
:::


## Disabled Dates

There are multiple ways that you can follow in order to display disabled dates.

:::demo
```html

<template>
    <div>
        <div>📅 Date: <span>{{ date }}</span></div>
        <d-datepicker
            v-model="date"
            :disabled-dates="disabledDates"
            typeable />
    </div>
</template>

<script>
export default {
  data() {
    return {
        date: new Date(2018, 8, 23),
        disabledDates: {
            // Disable all the dates up to specific date.
            to: new Date(2016, 0, 5),

            // Disable all dates after specific date.
            from: new Date(2016, 0, 26),

            // Disable only Saturdays and Sundays.
            days: [6, 0],

            // Disable 29th, 30th and 31st of each month.
            daysOfMonth: [29, 30, 31],
            
            // Disable an array of dates.
            dates: [
                new Date(2016, 9, 16),
                new Date(2016, 9, 17),
                new Date(2016, 9, 18)
            ],
            
            // Disable dates in given ranges (exclusive).
            ranges: [{
                from: new Date(2016, 11, 25),
                to: new Date(2016, 11, 30)
            }, {
                from: new Date(2017, 1, 12),
                to: new Date(2017, 2, 25)
            }],

            /**
             * You can also use a custom predictor function that returns true if
             * the date is disabled or false if it's not. You can use this callback
             * validator to provide your own date checking logic in case the options
             * above are not sufficient for your own use case.
             */
            customPredictor: function(date) {
                // Disables the date if it is a multiple of 5.
                if(date.getDate() % 5 == 0){
                    return true
                }
            }
        }
    }
  }
}
</script>

<!-- datepicker-2.vue -->
```
:::


## Highlighted Dates

:::demo
```html

<template>
    <div>
        <div>📅 Date: <span>{{ date }}</span></div>
        <d-datepicker
            v-model="date"
            :highlighted="highlightedDates"
            typeable />
    </div>
</template>

<script>
export default {
  data() {
    return {
        date: new Date(2018, 8, 23),
        highlightedDates: {
            // Highlight all dates up to specific date.
            to: new Date(2016, 0, 5),

            // Highlight all dates after specific date.
            from: new Date(2016, 0, 26),

            // Highlight Saturdays and Sundays.
            days: [6, 0],

            // Highlight 15th, 20th and 31st of each month.
            daysOfMonth: [15, 20, 31],

            // Highlight an array of dates.
            dates: [ 
                new Date(2016, 9, 16),
                new Date(2016, 9, 17),
                new Date(2016, 9, 18)
            ],

            /**
             * You can also use a custom predictor function that returns true if
             * the date is highlighted or false if it's not. You can use this callback
             * validator to provide your own date checking logic in case the options
             * above are not sufficient for your own use case.
             */
            customPredictor: function(date) {
            // Highlights the date if it is a multiple of 4.
                if(date.getDate() % 4 == 0){
                    return true
                }
            },
            
            // Highlight disabled dates
            includeDisabled: true
        }
    }
  }
}
</script>

<!-- datepicker-3.vue -->
```
:::
