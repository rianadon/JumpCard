Jump, Card!
-----------

JumpCard is a library for creating cards that can jump around.

Unlike a pure CSS solution or other masonry library, these cards will animate to their new position and can be moved around (again, still animating).

### See a [Demo](https://rianadon.github.io/JumpCard)!

### Usage

There are 4 files in the `dist/` directory.

First off, you'll need a JavaScript file. `jumpCard.js` is the raw ES2015 version. Good luck on supporting more than one or two browsers.
There's also `jumpCard-compiled.js` and `jumpCard-compiled.min.js`, which are compiled with Babel.

Then you'll need a stylesheet, which would be `jumpCard.css`.
This is pretty minimal and only contains the needed animation and other random properties to make everything work, so you'll need to add your own CSS to make the cards pretty.
THe demo's stylesheet is a great starting point for doing so.

### Getting Started

Once you've downloaded the library, you'll need to add it to your html style.
You can either add the JavaScript and CSS to whatever scripts and stylesheets you already have, or just include them separately in your html as shown below.

```html
<!DOCTYPE html>
<head>
<!-- Stuff goes here -->
<link href="jumpCard.css" rel="styleheet">
</head>
<body>
<!-- More stuff goes here -->
<script src="jumpCard.js"></script>
</body>
```

### Initialization

Now that you've included the script, you'll need to choose an element as your parent element containing the cards (let's call it `foo`).
Then, create a new `JumpCardGrid` instance.

```javascript
var jumpGrid = new JumpCardGrid(foo);
```

Yippee! That's it! Now all the cards will jump around magically.

### Options

Along with the passing to parent element to the `JumpCardGrid` selector, you can also give an options object as shown below.

```javascript
var jumpGrid = new JumpCardGrid(foo, options);
```

See the sections below for all the possible options.

### Breakpoints

The `breakPoints` option controls how many columns will be shown at which browser widths.
It defaults to `[400, 800, 1300, 1900, 2600, 3400]` and must be an array.

The number of columns is calculated by finding the first element of the array which is greater than or equal to the window's `innerWidth` then adding `1` to its index.

So, using the defaults, one column would be displayed if the window was `300px` wide, two if it was `600px` wide, and three if it was `1000px` wide.

### Card Selector

The `cardSelector` option controls the selector used to find all of the cards in the parent element used to initialize the grid.

It defaults to `.card`. In the case of the demo, the default is used, so every element inside the `main` element whose class is `card` will be positioned by JumpCard.

This option can be used to show only certain cards, so setting it to `.card.show` and adding `.card:not(.show) { display: none }` to your CSS would hide all cards that do not have the `show` class.

There's also the `cardClass` option, which sets the className to find and create new cards and `cardTag`, which sets the tag to be used for creating new cards.

### Order

The `order` option specifies the order in which the cards will be initially display. If it is `null`, which it defaults to, it will be automatically computed based on the order of the cards in the HTML.

The elements of the array correspond to the unique identifiers of the cards, which would be the `textContent` of the first element matching the `idSelector` option inside the card.

If the `idSelector` option is falsey, you'll have to manually set the `data-cardid` attribute on each card to whatever the `textContent` of the element matching `idSelector` would be.

You can retrieve this order at any time by calling a `JumpCardGrid`'s `getOrder()` method.

### User Sorting

If the `sortable` option is set to `true`, the cards will be able to be moved around.

This moving will be triggered by an `onmousedown` or `ontouchstart` event on the first element in the card matching the `handleSelector` option.

There are also numerous functions in the options that will be called whenever an event related to moving the cards is triggered, as detailed below. Each of these functions will be called with two arguments: the card element to which this event pertains and the raw event.

* `omMoveStart`: When the moving starts
* `omMove`: When the cursor / touch point moves
* `onPositionChange`: When the card changes its position relative to the other cards
* `omMoveEnd`: When the card is released

### Placeholder

When cards are manually moved around, a placeholder will appear to designate where they will land.
This placeholder's tag name can be customized with the `placeholderTag` option (defaults to `div`, and its class will be set to the `placeholderClass` option (defaults to `placeholder`).

### Gutter

The `gutter` option sets the amount of vertical space that will appear after each card.
For example, if each card had a margin of `12px`, the gutter should be set to `24`.

### Manually rendering

Calling `render()` on a `JumpCardGrid` instance will cause the cards' positions to be updated. Unlike calling `renderNow()`, the former will use the `requestAnimationFrame` function to debounce the call.

### Adding Cards

The `JumpCardGrid` class has the method `add`, which will insert a new card either at the end or at the specified position and optionally rerender.
The arguments are listed below.

* `innerHTML`: If this is a string, the card's `innerHTML` will be set to the argument's value. Otherwise, it will call `card.appendChild(innerHTML)`
* `name?`: The identifier for the card; If the argument is not given then the identifier will computed using the `idSelector` option
* `index = -1`: The index at which to insert the card into the order. If the index is less than 0, the card will be added to the end.
* `render = true`: Whether to recalculate the card positions

### Removing Cards

The `JumpCardGrid` class also has the method `<span class="token function">remove</span>`, which will insert a remove a card from the grid. Its arguments are as follows.

* `card`: The card element to be removed
* `removeElement = true`: Whether to remove the card from the DOM

### All of the options

As reference, here are all of the options and their default values as described here.

```javascript
{
  breakpoints: [400, 800, 1300, 1900, 2600, 3400],
  cardSelector: '.card',
  cardClass: 'card',
  cardTag: 'div',
  placeholderTag: 'div',
  placeholderClass: 'placeholder',
  idSelector: '.card-header',
  sortable: false,
  handleSelector: '.card-handle',
  order: [],
  gutter: 24,
  onMoveStart: () => {},
  onMove: () => {},
  onMoveEnd: () => {},
  onPositionChange: () => {},
}
```
