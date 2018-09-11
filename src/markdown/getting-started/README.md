# Getting Started

Shards Vue is really easy to get started with. Make sure to follow the guide below to get a better understanding about some of the decisions behind Shards Vue and how to use it to kick-start your next project.

> **Note:** This page is currently a work in progress.

## Installation

If you are using a module bundler such as [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/), you can install **Shards Vue** via [Yarn](https://yarnpkg.com/en/) or [NPM](https://www.npmjs.com/) and import Shards Vue directly into your project.

```bash
// Install via Yarn
yarn add shards-vue

// Install via NPM
npm i shards-vue
```

## Module Bundlers

You can register the entire UI kit as a Vue plugin in your app's entry point:

```javascript
import Vue from 'vue'
import ShardsVue from 'shards-vue'

// Import base styles (Bootstrap and Shards)
import 'bootstrap/dist/css/bootstrap.css'
import 'shards-ui/dist/css/shards.css'

Vue.use(ShardsVue);
```

## Registering Components as Vue Plugins

If you'd like to register only certain components as Vue plugins, make sure to import just the component you'd like to use.

```javascript
import Vue from 'vue'

// Import base styles (Bootstrap and Shards)
import 'bootstrap/dist/css/bootstrap.css'
import 'shards-ui/dist/css/shards.css'

import { Button } from 'shards-vue/src/components'
Vue.use(Button)

```

## Importing Single File Components

Importing single file components is also possible.

```vue
<template>
    <d-button @click="handleClick">Click Me!</d-button>
</template>

<script>
import dButton from 'shards-vue/src/components/button/Button'

export default {
    components: {
        dButton
    },
    methods: {
        handleClick() {
            alert('You just clicked me!')
        }
    }
}
</script>
```

## Naming Decisions

You will notice that all components are prefixed with `<d-{name}>`. The reason behind this decision is to provide a consistent naming experience across all existing and future products from DesignRevision.
