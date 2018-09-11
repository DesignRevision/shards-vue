# Collapse

The `<collapse>` component, together with the [`v-d-toggle`](/docs/directives/toggle) directive allow you to easily toggle the visibility of your content.

## Basic Example

:::demo
```html
<div>
    <d-btn v-d-toggle.my-collapse variant="primary">Toggle Collapse</d-btn>
    <d-collapse id="my-collapse">
        <div class="p-3 mt-3 border rounded">
            <h5>😍 Now you see me!</h5>
            <span>In sagittis nibh non arcu viverra, nec imperdiet quam suscipit. Sed porta eleifend scelerisque. Vestibulum dapibus quis arcu a facilisis.</span>
        </div>
    </d-collapse>
</div>

<!-- collapse-1.vue -->
```
:::

## Initial Visibility

Using the `visible` prop, you can make the `<d-collapse>` component show initially.

:::demo
```html
<div>
    <d-btn v-d-toggle.my-collapse variant="primary">Toggle Collapse</d-btn>
    <d-collapse visible id="my-collapse">
        <div class="p-3 mt-3 border rounded">
            <h5>😁 I'm already visible!</h5>
            <span>In sagittis nibh non arcu viverra, nec imperdiet quam suscipit. Sed porta eleifend scelerisque. Vestibulum dapibus quis arcu a facilisis.</span>
        </div>
    </d-collapse>
</div>

<!-- collapse-2.vue -->
```
:::

## Accordions

The `accordion` prop you allows you to create dynamic and flexible accordions.

:::demo
```html
<div>
    <d-card class="mb-1">
        <d-card-header class="px-3 py-2" role="tab">
            <d-btn block-level size="small" theme="secondary" href="#" v-d-toggle.accordion1>Accordion 1</d-btn>        
        </d-card-header>
        <d-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
            <d-card-body>
            <p class="card-text">Nullam augue tortor, viverra id gravida fermentum, posuere a libero. Curabitur at arcu tortor. Donec cursus blandit leo consequat convallis.</p>
            </d-card-body>
        </d-collapse>
    </d-card>

    <d-card class="mb-1">
        <d-card-header class="px-3 py-2" role="tab">
            <d-btn block-level size="small" theme="secondary" href="#" v-d-toggle.accordion2>Accordion 2</d-btn>        
        </d-card-header>
        <d-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
            <d-card-body>
            <p class="card-text">Etiam at congue tellus, vitae congue metus. Praesent eget arcu eget justo sodales venenatis. Nam nec est urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </d-card-body>
        </d-collapse>
    </d-card>

    <d-card class="mb-1">
        <d-card-header class="px-3 py-2" role="tab">
            <d-btn block-level size="small" theme="secondary" href="#" v-d-toggle.accordion3>Accordion 3</d-btn>        
        </d-card-header>
        <d-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
            <d-card-body>
            <p class="card-text">Maecenas tempor dapibus eros, ut ultricies est dapibus eu. Pellentesque quis nisi suscipit, dignissim nunc nec, rhoncus dolor. Maecenas tempus egestas egestas.</p>
            </d-card-body>
        </d-collapse>
    </d-card>
</div>

<!-- collapse-3.vue -->
```
:::
