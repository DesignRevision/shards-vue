# Alerts

Alerts allow you to display contextual feedback for various user actions.

## Basic Alerts

Alerts come in various contextual theme colors

:::demo
```html Alerts contextual theme colors example

<div>
    <d-alert show>Alert - Primary Theme (default) - <a class="alert-link" href="#">Example Link</a></d-alert>
    <d-alert theme="secondary" show>Alert - Secondary Theme - <a class="alert-link" href="#">Example Link</a></d-alert>
    <d-alert theme="success" show>Alert - Success Theme - <a class="alert-link" href="#">Example Link</a></d-alert>
    <d-alert theme="danger" show>Alert - Danger Theme - <a class="alert-link" href="#">Example Link</a></d-alert>
    <d-alert theme="warning" show>Alert - Warning Theme - <a class="alert-link" href="#">Example Link</a></d-alert>
    <d-alert theme="info" show>Alert - Info Theme - <a class="alert-link" href="#">Example Link</a></d-alert>
    <d-alert theme="light" show>Alert - Light Theme - <a class="alert-link" href="#">Example Link</a></d-alert>
    <d-alert theme="dark" show>Alert - Dark Theme - <a class="alert-link" href="#">Example Link</a></d-alert>
</div>

<!-- alerts-1.vue -->
```
:::

## Dismissible Alerts

Dismissible alerts provide the option to hide the alert with a close X button.

:::demo Dismissible alert example
```html

<div>
    <d-alert show dismissible>You can easily dismiss me using the <strong>close</strong> button &rarr;</d-alert>
</div>

<!-- alerts-2.vue -->
```
:::

## Self Dismissing Alerts

You can also control how much time an alert is visible by providing a `Number` in seconds for the `show` prop. 

:::demo Auto dismissible alert example.
```html

<template>
  <div>
    <d-alert dismissible
             :show="timeUntilDismissed"
             theme="success"
             @alert-dismissed="timeUntilDismissed = 0"
             @alert-dismiss-countdown="handleTimeChange">
        <b>Success!</b> This alert will will be dismissed in {{ timeUntilDismissed }} seconds!
    </d-alert>
    <d-btn @click="showAlert">
      Show Alert!
    </d-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      duration: 5,
      timeUntilDismissed: 0
    }
  },
  methods: {
    handleTimeChange (time) {
      this.timeUntilDismissed = time
    },
    showAlert () {
      this.timeUntilDismissed = this.duration
    }
  }
}
</script>

<!-- alerts-3.vue -->
```
:::

