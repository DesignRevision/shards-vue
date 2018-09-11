# Layout & Grid System

Shards Vue provides support for all native Bootstrap 4 layout elements including **containers**, **rows**, **columns** and **form rows** so you can use its full power while building your project's responsive layout powered by flexbox.

:::demo
```html
<d-container class="dr-example-container">
    <d-row>
        <d-col>1 / 12</d-col>
        <d-col>2 / 12</d-col>
        <d-col>3 / 12</d-col>
        <d-col>4 / 12</d-col>
        <d-col>5 / 12</d-col>
        <d-col>6 / 12</d-col>
        <d-col>7 / 12</d-col>
        <d-col>8 / 12</d-col>
        <d-col>9 / 12</d-col>
        <d-col>10 / 12</d-col>
        <d-col>11 / 12</d-col>
        <d-col>12 / 12</d-col>
    </d-row>

    <d-row>
        <d-col>1 / 6</d-col>
        <d-col>2 / 6</d-col>
        <d-col>3 / 6</d-col>
        <d-col>4 / 6</d-col>
        <d-col>5 / 6</d-col>
        <d-col>6 / 6</d-col>
    </d-row>

    <d-row>
        <d-col>1 / 3</d-col>
        <d-col>2 / 3</d-col>
        <d-col>3 / 3</d-col>
    </d-row>

    <d-row>
        <d-col>1 / 2</d-col>
        <d-col>2 / 2</d-col>
    </d-row>

    <d-row>
        <d-col>1 / 1</d-col>
    </d-row>
</d-container>

<!-- layout-containers-1.vue -->
```
:::
    
## Containers

Containers are the most **fundamental and required layout element** for your application or website's layout. You can use the `<d-container>` component for a fixed container, or `<d-container fluid>` for a fluid container.

## Rows

The `<d-row>` component must be placed inside a `<d-container>` component and it is used to define a row of columns. You can also use the `<d-form-row>` component for building form layouts that help you create a layout with more compact margins.

## Columns

The `<d-col>` component is used to represent a column and must be placed inside a `<d-row>` component. You can also use the `<d-col>` component without a breakpoint-specific prop (`sm`, `md`, `lg`, `xl`) for easy column sizing that have an equal width (as seen in the examples above).

## Mixing Breakpoints

You can use a combination of different props for each tier as needed.

:::demo
```html
<d-container class="dr-example-container">
    <d-row>
        <d-col cols="12" md="6" lg="8">cols="12" md="6" lg="8"</d-col>
        <d-col cols="12" md="6" lg="4">cols="12" md="6" lg="8"</d-col>
    </d-row>

    <d-row>
        <d-col cols="12" md="4" lg="3">cols="12" md="4" lg="3"</d-col>
        <d-col cols="12" md="4" lg="6">cols="12" md="4" lg="6"</d-col>
        <d-col cols="12" md="4" lg="3">cols="12" md="4" lg="3"</d-col>
    </d-row>

    <d-row>
        <d-col cols="12" md="6" lg="4">cols="12" md="6" lg="4"</d-col>
        <d-col cols="12" md="6" lg="8">cols="12" md="6" lg="8"</d-col>
    </d-row>
</d-container>

<!-- layout-containers-4.vue -->
```
:::

