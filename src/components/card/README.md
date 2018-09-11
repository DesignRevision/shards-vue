# Cards

Cards provide a flexible content container that you can use to display a variety of content using contextual background colors, headers and footers.

By default, cards fill in the full width of their parent element, however this can be customized via styling.

## Basic Example

:::demo
```html

<d-card style="max-width: 300px">
    <d-card-header>Card header</d-card-header>
    <d-card-img src="https://place-hold.it/300x200"/>
    <d-card-body title="Lorem Ipsum">
        <p>Lorem ipsum dolor sit amet.</p>
        <d-btn theme="primary">Read more &rarr;</d-btn>
    </d-card-body>
    <d-card-footer>Card footer</d-card-footer>
</d-card>

<!-- card-1.vue -->
```
:::

## Card Content Types

Cards support a large variety of content including images, links, text, list groups and more. Make sure to check out the examples below.

### Card Body

The core building block of a card is the `<d-card-body>`. You can use it whenever you'd like to add a padded section within a card.

:::demo
```html

<d-card>
    <d-card-body>
        Nunc quis nisl ac justo elementum sagittis in quis justo.
    </d-card-body>
</d-card>

<!-- card-2.vue -->
```
:::

#### Card Body Title and Subtitle

You can display a card's Title and Subtitle using the `title` and `subtitle` props on the `<d-card-body>` component.

:::demo
```html

<d-card>
    <d-card-body title="Card Title" subtitle="Card subtitle">
        Nunc quis nisl ac justo elementum sagittis in quis justo.
    </d-card-body>
</d-card>

<!-- card-3.vue -->
```
:::

### Card Image

Using the `<d-card-img>` component you can place a responsive image on top of the card that will adjust its width when the width of the card changes.

:::demo
```html

<div>
    <d-container>
        <d-row>
            <d-col>
                <d-card>
                    <d-card-img src="https://place-hold.it/300x200" top />
                    <d-card-body>
                        <div>this is the body contents</div>
                    </d-card-body>
                </d-card>
            </d-col>
            <d-col>
                <d-card>
                    <d-card-body>
                        <div>this is the body contents</div>
                    </d-card-body>
                    <d-card-img src="https://place-hold.it/300x200" bottom />
                </d-card>
            </d-col>
        </d-row>
    </d-container>
</div>

<!-- card-4.vue -->
```
:::
